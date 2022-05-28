from datetime import datetime

def handler(event, context):
    return {
        'statusCode': 200,
        'body': 'Pong {}! from (python lambda)'.format(datetime.now().isoformat())
    }
