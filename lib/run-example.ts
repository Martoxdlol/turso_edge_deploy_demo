import { createClient } from "@libsql/client/web";
import { fetchTursoApi, runTimedFunction } from "./utils";

export function runExample() {
    const stream = new ReadableStream({
        start: async (controller) => {
            controller.enqueue('[\n')

            function sendPartial(action: string, time: number) {
                const lines = (JSON.stringify({ action, time }, null, 2) + ',').split('\n')
                for (const line of lines) {
                    controller.enqueue('  ' + line + '\n')
                }
            }

            sendPartial('Start', 0)

            const [{ jwt: token }, timeJWT] = await runTimedFunction(async () => await fetchTursoApi<{ jwt: string }>('https://api.turso.tech/v1/organizations/{organizationName}/databases/db1/auth/tokens', {
                method: 'POST',
            }))

            sendPartial('Create jwt', timeJWT)

            const client = createClient({
                url: `libsql://db1-${process.env.TURSO_ORGANIZATION_NAME!}.turso.io`,
                authToken: token,
            });

            const [_, timeDelete] = await runTimedFunction(async () => await client.execute({
                sql: 'DROP TABLE IF EXISTS users;',
                args: []
            }))

            sendPartial('Delete users table', timeDelete)

            const [q1, time1] = await runTimedFunction(async () => await client.execute({
                sql: 'CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT);',
                args: []
            }))

            sendPartial('Create users table', time1)

            const [q2, time2] = await runTimedFunction(async () => await client.execute({
                sql: 'INSERT INTO users (id, name) VALUES (?, ?);',
                args: [2, 'Alice']
            }))

            sendPartial('Create single user table', time2)

            const [q3, time3] = await runTimedFunction(async () => await client.execute({
                sql: 'SELECT * FROM users;',
                args: []
            }))

            sendPartial('Select users', time3)

            const [t, timeT] = await runTimedFunction(async () => await client.transaction('write'))

            sendPartial('Start transaction', timeT)

            const [__, tt1] = await runTimedFunction(async () => await t.execute({
                sql: 'INSERT INTO users (id, name) VALUES (?, ?);',
                args: [3, 'Bob']
            }))

            sendPartial('Run transaction query', tt1)

            const [___, tt2] = await runTimedFunction(async () => await t.execute({
                sql: 'INSERT INTO users (id, name) VALUES (?, ?);',
                args: [4, 'Charlie']
            }))

            sendPartial('Run transaction query', tt2)

            const [____, tt3] = await runTimedFunction(async () => t.execute({
                sql: 'INSERT INTO users (id, name) VALUES (?, ?);',
                args: [5, 'David']
            }))

            sendPartial('Run transaction query', tt3)

            const [_____, tt4] = await runTimedFunction(async () => t.commit())

            sendPartial('Commit transaction', tt4)


            controller.enqueue(']\n')
            controller.close()
        }
    })

    return stream
}