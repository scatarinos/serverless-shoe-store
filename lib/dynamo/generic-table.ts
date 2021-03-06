import { Stack } from 'aws-cdk-lib'
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Runtime, Function, Code, Handler } from 'aws-cdk-lib/aws-lambda'
import { join } from 'path'
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway'


export interface TableProps {
    tableNamespace: string
    tableName: string
    primaryKey: string
    createLambdaPath?: string
    readLamdaPath?: string
    updateLambdaPath?: string
    deleteLambdaPath?: string,
    secondaryIndexes?: string[]
}


export class GenericTable {

    private stack: Stack
    private table: Table
    private props: TableProps

    public createLambda: NodejsFunction | Function | undefined
    public readLambda: NodejsFunction | Function | undefined
    public updateLambda: NodejsFunction | Function | undefined
    public deleteLambda: NodejsFunction | Function | undefined

    public createLambdaIntegration: LambdaIntegration
    public readLambdaIntegration: LambdaIntegration
    public updateLambdaIntegration: LambdaIntegration
    public deleteLambdaIntegration: LambdaIntegration


    public constructor(stack: Stack, props: TableProps) {
        this.stack = stack
        this.props = props

        this.initialize()
    }
    
    private initialize() {
        this.createTable()
        this.addSecondaryIndexes()
        this.createLambdas()
        this.grantTableRights()
    }
    

    private createTable () {
        this.table = new Table(this.stack, `${this.props.tableNamespace}.${this.props.tableName}`, {
            partitionKey: {
                name: this.props.primaryKey,
                type: AttributeType.STRING
            },
            tableName: `${this.props.tableNamespace}.${this.props.tableName}`
        })
    }

    private addSecondaryIndexes() {
        if( this.props.secondaryIndexes ) {
            for (const secondaryIndex of this.props.secondaryIndexes) {
                this.table.addGlobalSecondaryIndex({
                    indexName: secondaryIndex,
                    partitionKey: {
                        name: secondaryIndex,
                        type: AttributeType.STRING
                    },                    
                })
            }
        }
    }

    private grantTableRights() {
        if(this.createLambda) {
            this.table.grantWriteData(this.createLambda)
        }
        if(this.readLambda) {
            this.table.grantReadData(this.readLambda)
        }
        if (this.updateLambda) {
            this.table.grantWriteData(this.updateLambda)
        }
        if (this.deleteLambda) {
            this.table.grantWriteData(this.deleteLambda)
        }
    }

    private createLambdas() {

        // create
        if (this.props.createLambdaPath) {
            this.createLambda = this.createLambdaForPath(this.props.createLambdaPath)
            if (this.createLambda) {
                this.createLambdaIntegration = new LambdaIntegration(this.createLambda)    
            }
        }

        // read
        if (this.props.readLamdaPath) {
            this.readLambda = this.createLambdaForPath(this.props.readLamdaPath)
            if (this.readLambda) {
                this.readLambdaIntegration = new LambdaIntegration(this.readLambda)    
            }
        }

        // update
        if (this.props.updateLambdaPath) {
            this.updateLambda = this.createLambdaForPath(this.props.updateLambdaPath)
            if (this.updateLambda) {
                this.updateLambdaIntegration = new LambdaIntegration(this.updateLambda)    
            }
        }
        
        // delete
        if (this.props.deleteLambdaPath) {
            this.deleteLambda = this.createLambdaForPath(this.props.deleteLambdaPath)
            if (this.deleteLambda) {
                this.deleteLambdaIntegration = new LambdaIntegration(this.deleteLambda)    
            }
        }
    }

    /*
        Create the lambda ts-node or python lambda function for path e.g. ts/... or py/...
    */
    private createLambdaForPath(path: string): NodejsFunction | Function | undefined {
        if (path.includes('ts/')) {
            console.log('::: ts version')
            const name = path.replace('ts/', '')
            const entry = (join(__dirname, '..', 'services', this.props.tableName, `${path}.ts`))
            return this.createSingleLambdaNodejs(entry, name)
        } // resource/py
        else if (path.includes('py/')) {
            console.log('::: py version')
            const name = path.replace('py/', '')
            const entry = (join(__dirname, '..', 'services', this.props.tableName, `py`))
            console.log('::: ', entry)
            return this.createSingleLambdaPython(entry, name)
        }        
        return undefined
    }

    private createSingleLambdaNodejs(entry: string, name: string): NodejsFunction {
        console.log('::: entry', entry)
        console.log('::: name', name)
        const lambdaId = `${this.props.tableNamespace}-${this.props.tableName}-ts-${name}` 
        return new NodejsFunction(this.stack, lambdaId, {
            entry: entry,
            handler: 'handler',
            functionName: lambdaId,
            environment: {
                TABLE_NAMESPACE: this.props.tableNamespace,
                TABLE_NAME: this.props.tableName,
                PRIMARY_KEY: this.props.primaryKey
            }
        })
    }

    private createSingleLambdaPython(entry: string, name: string): Function {
        const lambdaId = `${this.props.tableNamespace}-${this.props.tableName}-py-${name}` 
        console.log(':::: entry ', entry)
        console.log(':::: name ', name)
        return new Function(this.stack, lambdaId, {
            runtime: Runtime.PYTHON_3_8,
            code: Code.fromAsset(entry),
            handler: `${name}.handler`,
            functionName: lambdaId,
            environment: {
                TABLE_NAMESPACE: this.props.tableNamespace,
                TABLE_NAME: this.props.tableName,
                PRIMARY_KEY: this.props.primaryKey
            }
        })
    }

}