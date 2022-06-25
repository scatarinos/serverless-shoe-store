import { APIGatewayAuthorizerResult, APIGatewayProxyEvent, APIGatewayTokenAuthorizerEvent } from 'aws-lambda'
import { handler as authentication}  from '../lib/services/auth/authentication'
import { handler as authorization}  from '../lib/services/auth/authorization'

const authEvent: APIGatewayProxyEvent = {
    body: {
        user: 'user@a.pt',
        password: '123456',
    }
} as any

const result = authentication(authEvent, {} as any).then(async (apiResult) => {
    const body = JSON.parse(apiResult.body)
    const { token } = body
    console.log(token)
    console.log('---')
    const event: APIGatewayTokenAuthorizerEvent = {
        authorizationToken: token,
        methodArn: '*',
        type: "TOKEN"
    }

    const result = await authorization(event, {} as any, function (result: any) {
            console.log(result)
        })
    console.log(result)
}) 
