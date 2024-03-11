export async function fetchTursoApi<T>(url: string, init?: RequestInit): Promise<T> {
    const urlWithOrg = url.replace('{organizationName}', process.env.TURSO_ORGANIZATION_NAME!)

    const response = await fetch(urlWithOrg, {
        ...init,
        cache: 'no-store',
        headers: {
            authorization: `Bearer ${process.env.TURSO_API_KEY!}`,
            ...init?.headers,
        }
    })

    return response.json() as T
}

export async function runTimedFunction<T>(fn: () => Promise<T>): Promise<[T, number]> {
    const timeStart = Date.now()

    const result = await fn()

    const timeEnd = Date.now()

    return [result, timeEnd - timeStart]
}

export function asyncDelay(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}