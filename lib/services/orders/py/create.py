import json
import boto3


def handler(event, context):
    print('request: {}'.format(json.dumps(event)))
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': 'Create Orders logic here {}'.format(event.get('path', 'no-path'))
    }