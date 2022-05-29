import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda"
import { getEventBody } from "../../helpers/helpers"

const jwt = require('jsonwebtoken')

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    const request = getEventBody(event)
    console.log('::: request ', request)
    try {
        const { user = '', password } = request
        // hacked for valid email and any password
        if ( user.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) && password ) {
            const token = jwt.sign(
                { user: user, },
                process.env.JWT_SECRET || 'NOT_SO_SECRET',
                {
                    expiresIn: '2h'
                }
            )
            return {
                statusCode: 200,
                body: JSON.stringify({
                    token
                })
            }    
        } else  {
            return {
                statusCode: 401,
                body: JSON.stringify({
                    message: 'Invalid Credentials'
                })
            }
        }
    
    } catch(err) {
        console.log(err)
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'System Error'
            })
        }
    }
}
export { handler }