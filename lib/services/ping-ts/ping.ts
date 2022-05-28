
async function handler(event: any, context:any) {
    console.log('::: handler in ping-ts')
    return {
        statusCode: 200,
        body: `Pong! (from ts-node lambda) `
    }
}
export { handler }
