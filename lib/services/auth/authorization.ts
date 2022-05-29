import { APIGatewayTokenAuthorizerHandler } from "aws-lambda"

const jwt = require('jsonwebtoken')

export const authorizer: APIGatewayTokenAuthorizerHandler = async (event) => {
    const token = event.authorizationToken;
    let effect = 'Deny';

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET || 'NOT_SO_SECRET')
        effect = 'Allow'
    } catch (err) {
        console.log('Errror ', err)

    }

    return {
        principalId: 'user',
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: '*',
                },
            ],
        },
    }
};

export { authorizer as handler }
