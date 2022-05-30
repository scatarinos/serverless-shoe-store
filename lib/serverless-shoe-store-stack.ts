import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi, CfnAuthorizer, TokenAuthorizer, Cors, MockIntegration, PassthroughBehavior } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { Runtime, Function, Code, Handler } from 'aws-cdk-lib/aws-lambda'
import { join } from 'path';
import { GenericTable } from './dynamo/generic-table';
import { Bucket } from 'aws-cdk-lib/aws-s3';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

import { } from './services/auth/authorization'
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
export class ServerlessShoeStoreStack extends Stack {

  private namespace = 'ShoeStore'

  private api = new RestApi(this, 'ShoeStoreApi', {
    description: 'example-api',
    // 👇 set up CORS
    defaultCorsPreflightOptions: {
      /*      
      allowHeaders: [
        'Content-Type',
        'X-Amz-Date',
        'Authorization',
        'X-Api-Key',
      ],
      */
      allowHeaders: Cors.DEFAULT_HEADERS,
      allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowCredentials: true,
      allowOrigins: ['http://localhost:3000']
      //allowOrigins: ['*'],
      //allowOrigins: Cors.ALL_ORIGINS,
      
    },
    
  })
  




  private shoesTable = new GenericTable(this, {
    tableNamespace: `${this.namespace}`,
    tableName: `shoes`,
    primaryKey: 'id',
    createLambdaPath: 'py/create',
    readLamdaPath: 'py/read',
    updateLambdaPath: 'py/update',
    deleteLambdaPath: 'py/delete',
    secondaryIndexes: ['brand']
  })
  
  private ordersTable = new GenericTable(this, {
    tableNamespace: `${this.namespace}`,
    tableName: `orders`,
    primaryKey: 'id',
    createLambdaPath: 'py/create',
    readLamdaPath: 'py/read',
    updateLambdaPath: 'py/update',
    deleteLambdaPath: 'py/delete',
  })

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

/*
    const method = this.api.root.addMethod('OPTIONS', new MockIntegration({
      integrationResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Headers": "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
            "method.response.header.Access-Control-Allow-Methods": "'GET,POST,OPTIONS'",
            "method.response.header.Access-Control-Allow-Origin": "'*'"
          },
          responseTemplates: {
            "application/json": ""
          }
        }
      ],
      // passthroughBehavior: PassthroughBehavior.Never,
      requestTemplates: {
        "application/json": "{\"statusCode\": 200}"
      },
    }));
    */
    
    // Authentication
    const authenticationFn = new NodejsFunction(this, 'ShoeStoreApiBasicAuthAuthentication', {
      entry: (join(__dirname, '.', 'services', 'auth', 'authentication.ts')),
      handler: 'handler',
    });
    const authenticationIntegration = new LambdaIntegration(authenticationFn)
    const authenticationResource = this.api.root.addResource('authentication')
    authenticationResource.addMethod('POST', authenticationIntegration)


    // Authorizer
    const authorizerFn = new NodejsFunction(this, 'ShoeStoreApiBasicAuthAuthorizer', {
      entry: (join(__dirname, '.', 'services', 'auth', 'authorization.ts')),
      handler: 'authorizer',
    });

    const authorizer = new TokenAuthorizer(this, 'ShoeStoreApiCustomBasicAuthAuthorizer', {
      handler: authorizerFn,
      identitySource: 'method.request.header.Authorization',
    });

    
    // shoes API Integrations
    const shoesResource = this.api.root.addResource('shoes',
    {
      defaultCorsPreflightOptions: {
        allowOrigins: ['http://localhost:3000'],
        allowHeaders: Cors.DEFAULT_HEADERS.concat(['x-api-key'])        
      }
    }
    )
    shoesResource.addMethod('POST', this.shoesTable.createLambdaIntegration, { authorizer })
    shoesResource.addMethod('GET', this.shoesTable.readLambdaIntegration) // public
    shoesResource.addMethod('PUT', this.shoesTable.updateLambdaIntegration, { authorizer })
    shoesResource.addMethod('DELETE', this.shoesTable.deleteLambdaIntegration, { authorizer })

    // orders API Integrations
    const ordersResource = this.api.root.addResource('orders')
    ordersResource.addMethod('POST', this.ordersTable.createLambdaIntegration, { authorizer })
    ordersResource.addMethod('GET', this.ordersTable.readLambdaIntegration, { authorizer })
    ordersResource.addMethod('PUT', this.ordersTable.updateLambdaIntegration, { authorizer })
    ordersResource.addMethod('DELETE', this.ordersTable.deleteLambdaIntegration, { authorizer })



    // 👇 create the s3 bucket
    const bucket1 = new Bucket(this, 'orders', {
      // removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const s3Policy = new PolicyStatement()
    s3Policy.addActions('s3:ListAllMyBuckets')
    s3Policy.addActions('s3:PutObject')
    s3Policy.addResources('*')
    this.ordersTable.createLambda!.addToRolePolicy(s3Policy)

    
        
    /* pong demo endpoints */
    const pingLambdaNodejs = new NodejsFunction(this, 'pingLambdaNodejs', {
      entry: (join(__dirname, '.', 'services', 'ping-ts', 'ping.ts')),
      handler: 'handler'
    })
    const pingLambdaNodeJsIntegration = new LambdaIntegration(pingLambdaNodejs)
    const pingLambdaNodeJsResource = this.api.root.addResource('pingts')
    pingLambdaNodeJsResource.addMethod('GET', pingLambdaNodeJsIntegration)
        

    const pingLambdaPython = new Function(this, 'pingLambdaPython', {
      runtime: Runtime.PYTHON_3_8,
      code: Code.fromAsset(join(__dirname, '.', 'services', 'ping-py')),
      handler: 'ping.handler'
    })
    const pingLambdaPythonIntegration = new LambdaIntegration(pingLambdaPython)
    const pingLambdaPythonResource = this.api.root.addResource('pingpy')
    pingLambdaPythonResource.addMethod('GET', pingLambdaPythonIntegration)


  }
}
