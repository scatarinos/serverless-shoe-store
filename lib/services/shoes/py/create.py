import json
import os
import boto3

client = boto3.client('dynamodb')

def handler(event, context):

    TABLE_NAMESPACE = os.environ["TABLE_NAMESPACE"]
    TABLE_NAME = '{}.shoes'.format(TABLE_NAMESPACE)

    # TODO
    # item = {
    #    "id": {"S": "1"},
    #    "reference": {"S": "ref1"},
    #    "brand": {"S": "Puma"},
    #    "size": {"SS": ["40", "41", "42"]},
    #    "price": {"N": "50"}
    #}


    # response = client.put_item(
    #    TableName=TABLE_NAME,
    #    Item=item
    # )

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': 'Create for {}: Not Implemented Yet!'.format(TABLE_NAME)
    }