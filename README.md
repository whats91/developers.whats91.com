# Whats91 Developer Documentation

The official developer documentation site for **Whats91** — WhatsApp Messaging & API Services.

**Live site:** [developers.whats91.com](https://developers.whats91.com)

## Overview

This is a Next.js 16 developer documentation portal built with a Mintlify-inspired design system. It provides comprehensive documentation for Whats91's WhatsApp Business API, messaging services, and integration guides.

## Features

- **3-Column Documentation Layout** — Sidebar navigation, main content area, and table of contents
- **Full-Text Search** — Press `⌘K` / `Ctrl+K` to search across all documentation
- **Responsive Design** — Mobile-first layout with slide-in sidebar on small screens
- **API Reference** — Interactive API endpoint documentation with code samples
- **Changelog** — Timeline-style changelog with filterable updates
- **Syntax Highlighting** — Code blocks with copy-to-clipboard functionality
- **Dark Code Blocks** — Professional code presentation inspired by Mintlify

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **State Management:** Zustand
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 20.9+ (Node.js 22 LTS recommended)
- npm 10+
- PM2 for CloudPanel production deployment

### Installation

```bash
# Clone the repository
git clone https://github.com/whats91/developers.whats91.com.git
cd developers.whats91.com

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:3000` unless `PORT` is set.

### Build for Production

```bash
npm run build
npm run start
```

### CloudPanel / PM2 Deployment

Create a `.env` file in the project root. The Node.js bootstrap loads this file before starting the generated Next.js standalone server.

```bash
cp .env.example .env
```

Typical production values:

```dotenv
NODE_ENV=production
PORT=3000
```

Do not set `HOSTNAME` in CloudPanel. The bootstrap removes any inherited `HOSTNAME` before starting Next.js so the standalone server binds to the default host for the configured `PORT`; setting a public server IP can cause CloudPanel reverse-proxy 502 errors.
The bootstrap also sets `ROOT_PATH` and `PROJECT_ROOT` to the project directory before loading the standalone server, so webhook deployments can find `scripts/deploy.js` even if the standalone runtime changes the current working directory.

Install, build, and start the application with PM2:

```bash
npm ci
npm run build
npm run pm2:start
pm2 save
```

For an existing PM2 process after changing `.env`:

```bash
npm run pm2:reload
```

CloudPanel can also run `npm start` directly after `npm run build`. PM2 logs should be used for production logging; the npm scripts intentionally do not pipe output to log files.

### Automated GitHub Webhook Deployment

The project includes a deployment webhook that can be configured in GitHub so pushes to `main` update the production website automatically.

Recommended `.env` values:

```dotenv
DEPLOY_DOMAIN=developers.whats91.com
DEPLOY_REPO_URL=https://github.com/whats91/developers.whats91.com.git
DEPLOY_BRANCH=main
DEPLOY_PM2_APP_NAME=developers-whats91-com
DEPLOY_WEBHOOK_TOKEN=replace-with-a-long-random-string
GITHUB_WEBHOOK_SECRET=replace-with-github-webhook-secret
DEPLOY_WEBHOOK_MAX_BODY_BYTES=1048576
```

Manual server-side deployment command:

```bash
npm run deploy:run
```

GitHub webhook settings:

- Payload URL: `https://developers.whats91.com/api/webhooks/deploy?token=YOUR_TOKEN`
- Secret: use the same value as `GITHUB_WEBHOOK_SECRET`
- Content type: `application/json`
- Event: push only
- Branch: `main`

The deploy webhook fails closed in production when `DEPLOY_WEBHOOK_TOKEN` or `GITHUB_WEBHOOK_SECRET` is missing. The repository is public, so no GitHub token is needed for deployment fetches. Deployment logs are written to `logs/deploy-webhook.log`.

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles & design tokens
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Main documentation page
│   └── api/route.ts         # API routes
├── components/
│   ├── docs/
│   │   ├── sidebar.tsx      # Left sidebar navigation
│   │   ├── top-navbar.tsx   # Top navigation bar
│   │   ├── search-dialog.tsx # Search modal (⌘K)
│   │   ├── content-renderer.tsx # Documentation content renderer
│   │   ├── table-of-contents.tsx # Right-side TOC
│   │   ├── changelog-page.tsx  # Changelog timeline
│   │   └── footer.tsx       # Site footer
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── doc-data.ts          # Documentation content data
│   ├── doc-store.ts         # Zustand state store
│   ├── db.ts                # Database client
│   └── utils.ts             # Utility functions
└── hooks/                   # Custom React hooks
```

## Documentation Sections

| Category | Sections |
|----------|----------|
| **Getting Started** | Overview, Quick Start, Authentication |
| **Messaging API** | Send Messages, Receive Messages, Message Templates, Media Messages |
| **WhatsApp Business** | Business Profile, Phone Numbers, Webhooks, Two-Step Verification |
| **API Reference** | REST API, Error Codes, Rate Limits, Webhook Events |
| **Changelog** | All Updates, API Changes, Feature Releases |

## Design System

The UI follows a Mintlify-inspired design system with:

- **Brand Green** (`#00d4a4`) for accent CTAs and active states
- **Inter** font for UI text, **Geist Mono** for code
- Black pill buttons for primary CTAs
- 3-column documentation grid (sidebar / prose / TOC)
- Consistent 12px border radius for cards, pill buttons for CTAs

## License

Proprietary — © Whats91
