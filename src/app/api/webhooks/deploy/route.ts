import { spawn } from 'node:child_process'
import { timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type DeployPayload = {
  ref?: string
}

function safeCompare(expected: string, provided: string) {
  const expectedBuffer = Buffer.from(expected)
  const providedBuffer = Buffer.from(provided)

  if (expectedBuffer.length !== providedBuffer.length) return false
  return timingSafeEqual(expectedBuffer, providedBuffer)
}

function isAuthorized(request: NextRequest) {
  const configuredToken = process.env.DEPLOY_WEBHOOK_TOKEN?.trim()
  if (!configuredToken) return true

  const providedToken =
    request.nextUrl.searchParams.get('token')?.trim() ||
    request.headers.get('x-deploy-token')?.trim() ||
    ''

  return safeCompare(configuredToken, providedToken)
}

function resolveProjectRoot() {
  return (
    process.env.ROOT_PATH?.trim() ||
    process.env.DEPLOY_ROOT_PATH?.trim() ||
    process.env.DEPLOY_PROJECT_PATH?.trim() ||
    '.'
  )
}

async function readPayload(request: NextRequest): Promise<DeployPayload> {
  try {
    return (await request.json()) as DeployPayload
  } catch {
    return {}
  }
}

function quoteForShell(value: string) {
  return `'${value.replace(/'/g, `'\\''`)}'`
}

function joinProjectPath(projectRoot: string, ...parts: string[]) {
  const normalizedRoot = projectRoot.replace(/\/+$/g, '')
  if (!normalizedRoot || normalizedRoot === '.') return parts.join('/')

  return [normalizedRoot, ...parts].join('/')
}

function startDetachedDeployment(projectRoot: string, sourceLabel: string) {
  const deployScriptPath = joinProjectPath(projectRoot, 'scripts/deploy.js')
  const logDirectory = joinProjectPath(projectRoot, 'logs')
  const logPath = process.env.DEPLOY_WEBHOOK_LOG_PATH || joinProjectPath(logDirectory, 'deploy-webhook.log')
  const requestedLine = `[${new Date().toISOString()}] [deploy-webhook] Deployment requested from ${sourceLabel}`
  const shellCommand = [
    `mkdir -p ${quoteForShell(logDirectory)}`,
    `printf '%s\\n' ${quoteForShell(requestedLine)} >> ${quoteForShell(logPath)}`,
    `(nohup ${quoteForShell(process.execPath)} ${quoteForShell(deployScriptPath)} >> ${quoteForShell(logPath)} 2>&1 < /dev/null & echo $!)`,
  ].join(' && ')

  const child = spawn('/bin/sh', ['-lc', shellCommand], {
    cwd: projectRoot,
    detached: true,
    env: buildDeployEnv(projectRoot, sourceLabel),
    stdio: ['ignore', 'ignore', 'ignore'],
    windowsHide: true,
  })

  child.unref()

  return {
    logPath,
    pid: child.pid,
  }
}

function buildDeployEnv(projectRoot: string, sourceLabel: string) {
  return {
    ...process.env,
    ROOT_PATH: process.env.ROOT_PATH || projectRoot,
    PROJECT_ROOT: process.env.PROJECT_ROOT || projectRoot,
    DEPLOY_NON_INTERACTIVE: '1',
    DEPLOY_TRIGGER_SOURCE: sourceLabel,
    CI: process.env.CI || 'true',
    GIT_TERMINAL_PROMPT: '0',
    DEBIAN_FRONTEND: 'noninteractive',
    NPM_CONFIG_YES: 'true',
    npm_config_yes: 'true',
    TERM: process.env.TERM || 'dumb',
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized deploy webhook request.',
      },
      { status: 401 }
    )
  }

  return NextResponse.json({
    success: true,
    message: 'Deploy webhook is ready. GitHub must call this endpoint with POST.',
    method: 'POST',
    events: ['ping', 'push'],
    branch: process.env.DEPLOY_BRANCH || 'main',
    tokenConfigured: Boolean(process.env.DEPLOY_WEBHOOK_TOKEN?.trim()),
  })
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized deploy webhook request.',
      },
      { status: 401 }
    )
  }

  const event = request.headers.get('x-github-event') || ''
  if (event === 'ping') {
    return NextResponse.json({
      success: true,
      message: 'Deploy webhook ping received.',
    })
  }

  const payload = await readPayload(request)
  if (event === 'push' && payload.ref !== 'refs/heads/main') {
    return NextResponse.json({
      success: true,
      ignored: true,
      message: `Ignored push for ${payload.ref || 'unknown ref'}.`,
    })
  }

  if (event && event !== 'push') {
    return NextResponse.json({
      success: true,
      ignored: true,
      message: `Ignored GitHub ${event} event.`,
    })
  }

  try {
    const projectRoot = resolveProjectRoot()
    const result = startDetachedDeployment(
      projectRoot,
      request.headers.get('x-forwarded-for') || 'webhook'
    )

    return NextResponse.json(
      {
        success: true,
        queued: true,
        message: 'Deployment started.',
        logPath: result.logPath,
        pid: result.pid,
      },
      { status: 202 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to start deployment.',
      },
      { status: 500 }
    )
  }
}
