import json
import os
import boto3

client = boto3.client('dynamodb')
  
def handler(event, context):

    TABLE_NAMESPACE = os.environ["TABLE_NAMESPACE"]
    TABLE_NAME = '{}.shoes'.format(TABLE_NAMESPACE)
    
    #--expression-attribute-values '{
    #    ":username": { "S": "daffyduck" },
    #    ":startdate": { "S": "20170101" },
    #    ":enddate": { "S": "20180101" }
        
    ##--key-condition-expression "Username = :username AND OrderId BETWEEN :startdate AND :enddate" \

        
    queryStringParameters = event.get('queryStringParameters', {})
    if 'id' in queryStringParameters.keys():
        keyValue = str(queryStringParameters.get('id'))
        result = client.query(
            TableName=TABLE_NAME,
            KeyConditionExpression='id = :value',
            ExpressionAttributeValues={
                ':value': {"S": keyValue }
            }
        )
    elif 'brand' in queryStringParameters.keys():
        keyValue = str(queryStringParameters.get('brand'))
        result = client.query(
            TableName=TABLE_NAME,
            IndexName='brand',
            KeyConditionExpression='brand = :value',
            ExpressionAttributeValues={
                ':value': {"S": keyValue }
            }
        )
    else:
        result = client.scan(
            TableName=TABLE_NAME,
            Limit=100
        )
        
    result_dict = [
        {
            'id': item.get('id', {}).get('S'),
            'brand': item.get('brand', {}).get('S'),
            'sizes': item.get('sizes', {}).get('SS'),
            'reference': item.get('reference', {}).get('S'),
            'price': float(item.get('price', {}).get('N', '0.0')),
        }
        for item in result["Items"]
    ]
    
     #'headers': {
     #       'Access-Control-Allow-Headers': 'Content-Type',
     #       'Access-Control-Allow-Origin': '*',
     #       'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
     #   },

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
           'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'

        },
        'body': json.dumps(result_dict)
    }