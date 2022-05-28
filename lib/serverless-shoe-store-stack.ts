import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { Runtime, Function, Code, Handler } from 'aws-cdk-lib/aws-lambda'
import { join } from 'path';
import { GenericTable } from './dynamo/generic-table';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class ServerlessShoeStoreStack extends Stack {

  private api = new RestApi(this, 'ShoeStoreApi')

  private shoesTable = new GenericTable(this, {
    tableName: 'shoes',
    primaryKey: 'id',
    createLambdaPath: 'py/create',
    readLamdaPath: 'py/read',
    updateLambdaPath: 'py/update',
    deleteLambdaPath: 'ts/delete',
    // secondaryIndexes: ['brand']
  })
  
  private ordersTable = new GenericTable(this, {
    tableName: 'orders',
    primaryKey: 'id',
    createLambdaPath: 'py/create',
    readLamdaPath: 'py/read',
    updateLambdaPath: 'py/update',
    deleteLambdaPath: 'ts/delete',
  })

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);


    // shoes API Integrations
    const shoesResource = this.api.root.addResource('shoes')
    shoesResource.addMethod('POST', this.shoesTable.createLambdaIntegration)
    shoesResource.addMethod('GET', this.shoesTable.readLambdaIntegration)
    shoesResource.addMethod('PUT', this.shoesTable.updateLambdaIntegration)
    shoesResource.addMethod('DELETE', this.shoesTable.deleteLambdaIntegration)

    // orders API Integrations
    const ordersResource = this.api.root.addResource('orders')
    ordersResource.addMethod('POST', this.ordersTable.createLambdaIntegration)
    ordersResource.addMethod('GET', this.ordersTable.readLambdaIntegration)
    ordersResource.addMethod('PUT', this.ordersTable.updateLambdaIntegration)
    ordersResource.addMethod('DELETE', this.ordersTable.deleteLambdaIntegration)


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
