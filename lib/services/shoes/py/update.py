import os
import json
import boto3

def handler(event, context):

    TABLE_NAMESPACE = os.environ["TABLE_NAMESPACE"]
    TABLE_NAME = '{}.shoes'.format(TABLE_NAMESPACE)

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': 'Update for {}: Not Implemented Yet!'.format(TABLE_NAME)
    }