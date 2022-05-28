import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { Runtime, Function, Code, Handler } from 'aws-cdk-lib/aws-lambda'
import { join } from 'path';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class ServerlessShoeStoreStack extends Stack {

  private api = new RestApi(this, 'ShoeStoreApi')

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);



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
