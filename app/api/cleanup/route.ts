import { NextRequest, NextResponse } from "next/server";
import { fetchTursoApi } from "~/lib/utils";

export async function GET(request: NextRequest) {

    await fetchTursoApi('https://api.turso.tech/v1/organizations/{organizationName}/databases/db1', {
        method: 'DELETE',
    })

    await fetchTursoApi('https://api.turso.tech/v1/organizations/{organizationName}/groups/group1', {
        method: 'DELETE',
    })

    const { groups } = await fetchTursoApi<{ groups: any[] }>('https://api.turso.tech/v1/organizations/{organizationName}/groups')
    const { databases } = await fetchTursoApi<{ databases: any[] }>('https://api.turso.tech/v1/organizations/{organizationName}/databases')


    return new Response(JSON.stringify({
        groups,
        databases,
    }, null, 2), {
        headers: {
            'content-type': 'application/json',
        },
    })
}