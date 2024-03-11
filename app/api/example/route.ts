import { createClient } from "@libsql/client/web";
import { unstable_noStore } from "next/cache";
import { NextRequest } from "next/server";
import { runExample } from "~/lib/run-example";
import { fetchTursoApi, runTimedFunction } from "~/lib/utils";

export const runtime = 'edge'
export const preferredRegion = ['sfo1'];

export async function GET(request: NextRequest) {
    unstable_noStore()

    const stream = runExample()

    const textFromStream = await streamToText(stream)

    return new Response(textFromStream, {
        headers: {
            'content-type': 'application/json',
        },
    })
}

function streamToText(stream: ReadableStream) {
    const reader = stream.getReader()
    let text = ''
    return new Promise<string>((resolve, reject) => {
        function pump() {
            reader.read().then(({ done, value }) => {
                if (done) {
                    resolve(text)
                    return
                }
                text += value
                pump()
            }).catch(reject)
        }
        pump()
    })
}