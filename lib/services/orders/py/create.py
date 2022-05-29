import json
import os
import boto3
import uuid
import datetime

client = boto3.client('dynamodb')
s3 = boto3.resource('s3')

s3_client = boto3.client('s3')


def handler(event, context):

    TABLE_NAMESPACE = os.environ["TABLE_NAMESPACE"]
    TABLE_NAME = '{}.orders'.format(TABLE_NAMESPACE)
    id = str(uuid.uuid4())
    date = datetime.datetime.now().isoformat()[:19]
    
    payload = event.get('body')
    
    lines = [
        {
            "M" : {
                "reference": {"S" : l.get('reference', '')},
                "size": {"S": l.get('size', '')},
                "price": {"N": str(l.get('price', '0'))}
            }
        }
        for l in payload.get('lines')
    ]

    item = {
        "id": {"S": id},
        "date": {"S": date},
        "client": {"S": payload.get('client', '')},
        "lines": {"L": lines},
        "shipping": {
            "M" : {
                "address": {"S": payload.get('shipping', {}).get('address', '')},
                "city": {"S": payload.get('shipping', {}).get('city', '')},
                "zip": {"S": payload.get('shipping', {}).get('zip', '')},
            }
        }

    }

    # put item
    response = client.put_item(
        TableName=TABLE_NAME,
        Item=item
    )

    # TODO: review
    my_bucket = None
    for bucket in s3.buckets.all():
        if 'orders' in bucket.name:
            my_bucket = bucket
    if (my_bucket):
        payload['id'] = id
        payload['date'] = date
        s3_client.put_object(Body=json.dumps(payload), Bucket=my_bucket.name, Key='order-{}.json'.format(id))


    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': 'Item id={} for {} created'.format(id, TABLE_NAME)
    }