import { APIGatewayProxyEvent } from "aws-lambda";

export function generateRandomId() {
    return Math.random().toString(36).slice(2)
}

export function getEventBody(event: APIGatewayProxyEvent,) {
    try {
        return typeof event.body == 'object' ? event.body: JSON.parse(event.body)    
    } catch(err) {
        console.log(err)
        return {}
    }
}