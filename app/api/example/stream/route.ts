import { unstable_noStore } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import { runExample } from "~/lib/run-example"

export const runtime = 'nodejs'
export const preferredRegion = ['sfo1'];

export async function GET(request: NextRequest) {
    unstable_noStore()

    const stream = runExample()

    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    })
}