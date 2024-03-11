import { unstable_noStore } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { fetchTursoApi } from "~/lib/utils";

export const runtime = 'edge'

export async function GET(request: NextRequest) {
    unstable_noStore()

    const { groups } = await fetchTursoApi<{ groups: any[] }>('https://api.turso.tech/v1/organizations/{organizationName}/groups')
    const { databases } = await fetchTursoApi<{ databases: any[] }>('https://api.turso.tech/v1/organizations/{organizationName}/databases')

    const { group: group1 } = await fetchTursoApi<{ group: any }>('https://api.turso.tech/v1/organizations/{organizationName}/groups', {
        method: 'POST',
        body: JSON.stringify({
            extensions: 'all',
            location: 'sjc', // eze (ARG)
            name: 'group1'
        })
    })

    const { database: db1 } = await fetchTursoApi<{ database: any }>('https://api.turso.tech/v1/organizations/{organizationName}/databases', {
        method: 'POST',
        body: JSON.stringify({
            group: 'group1',
            name: 'db1',
            size_limit: '256MB'
        })
    })

    return new Response(JSON.stringify({
        groups,
        databases,
        group1,
        db1,
    }, null, 2), {
        headers: {
            'content-type': 'application/json',
        },
    })
}