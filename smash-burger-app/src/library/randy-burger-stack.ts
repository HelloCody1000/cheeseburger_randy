import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class RandyBurgerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ============================================================
    // 1. DATABASE (DynamoDB)
    // ============================================================
    const ordersTable = new dynamodb.Table(this, 'OrdersTable', {
      partitionKey: { name: 'toastGuid', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT for production! (Keeps AWS clean while testing)
    });

    // ============================================================
    // 2. COMPUTE (Lambda)
    // ============================================================
    const createOrderLambda = new nodejs.NodejsFunction(this, 'CreateOrderFunction', {
      entry: 'lambda/create-order/index.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X, // Always use a modern runtime
      environment: {
        TABLE_NAME: ordersTable.tableName,
        // TODO: You will need to add your real keys here later
        TOAST_CLIENT_ID: 'PLACEHOLDER_ID', 
        TOAST_CLIENT_SECRET: 'PLACEHOLDER_SECRET',
        RESTAURANT_GUID: 'PLACEHOLDER_GUID'
      },
      bundling: {
        minify: true,
        sourceMap: true,
      },
    });

    // Grant the Lambda permission to write to the DB
    ordersTable.grantWriteData(createOrderLambda);

    // ============================================================
    // 3. THE FRONT DOOR (API Gateway)
    // ============================================================
    const api = new apigateway.RestApi(this, 'RandyBurgerApi', {
      restApiName: 'Randy Burger Service',
      description: 'Handles orders for the Randy Burger project',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS, // Allows your React app to talk to this
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // Create the endpoint: POST /orders
    const ordersResource = api.root.addResource('orders');
    ordersResource.addMethod('POST', new apigateway.LambdaIntegration(createOrderLambda));
    
    // Output the URL to the console after deploy
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'The URL to use in your React App',
    });
  }
}