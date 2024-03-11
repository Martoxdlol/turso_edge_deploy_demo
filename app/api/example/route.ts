import { unstable_noStore } from "next/cache";
import { NextRequest } from "next/server";
import { runExample } from "~/lib/run-example";

export const runtime = 'edge'

export async function GET(request: NextRequest) {
    unstable_noStore()

    const stream = runExample()

    return new Response(stream, {
        headers: {
            'content-type': 'application/json',
        },
    })
}