// lib/randy-burger-stack.ts

// 1. Create the Table
const ordersTable = new dynamodb.Table(this, 'OrdersTable', {
  partitionKey: { name: 'toastGuid', type: dynamodb.AttributeType.STRING }, // <--- MUST MATCH CODE
  billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
});

// 2. Create the Lambda
const createOrderLambda = new nodejs.NodejsFunction(this, 'CreateOrderFunction', {
  entry: 'lambda/create-order/index.ts', // Points to the main file
  environment: {
    TABLE_NAME: ordersTable.tableName, // <--- This populates process.env.TABLE_NAME
    // ... other env vars like TOAST_CLIENT_ID
  },
});

// 3. GRANT PERMISSION (Don't forget this!)
ordersTable.grantWriteData(createOrderLambda);