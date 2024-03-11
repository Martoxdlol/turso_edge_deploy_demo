import { NextRequest } from "next/server";
import { runExample } from "~/lib/run-example";

export const runtime = 'edge'

export async function GET(request: NextRequest) {
    const stream = runExample()

    return new Response(stream, {
        headers: {
            'content-type': 'application/json',
        },
    })
}