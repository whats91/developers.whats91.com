import { NextResponse } from 'next/server'
import { getSearchIndexEntries } from '@/lib/doc-data'
import { getPathForSectionId } from '@/lib/doc-routes'

export function GET() {
  return NextResponse.json(
    getSearchIndexEntries().map((entry) => ({
      ...entry,
      canonicalPath: getPathForSectionId(entry.sectionId),
    }))
  )
}
