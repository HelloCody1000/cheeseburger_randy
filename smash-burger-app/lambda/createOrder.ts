// lambda/create-order.ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import axios from 'axios';
import { DynamoDB } from 'aws-sdk';

const dynamo = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  const body = JSON.parse(event.body || '{}');
  
  // 1. Authenticate with Toast (Get Access Token)
  // (In production, cache this token! Don't login every single time)
  const authResponse = await axios.post('https://ws-api.toasttab.com/authentication/v1/authentication/login', {
    clientId: process.env.TOAST_CLIENT_ID,
    clientSecret: process.env.TOAST_CLIENT_SECRET,
    userAccessType: "TOAST_MACHINE_CLIENT" 
  });
  const token = authResponse.data.token.accessToken;

  // 2. Build the Toast Order Payload (Simplified)
  // NOTICE: No 'payments' array included here!
  const toastPayload = {
    restaurantGuid: process.env.RESTAURANT_GUID,
    diningOption: { guid: "YOUR_PICKUP_OPTION_GUID" }, // You must query this from Toast first
    checks: [
      {
        selections: body.items.map((item: any) => ({
          itemGroup: { guid: item.toastItemGuid }, // The burger GUID
          quantity: 1,
          modifiers: item.modifiers // The cheese/toppings GUIDs
        }))
      }
    ]
  };

  // 3. Send to Toast
  const toastRes = await axios.post(`https://ws-api.toasttab.com/orders/v2/orders/${process.env.RESTAURANT_GUID}`, toastPayload, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const toastOrderGuid = toastRes.data.guid;

  // 4. Save to DynamoDB so we can track status later
  await dynamo.put({
    TableName: process.env.TABLE_NAME!,
    Item: {
      orderId: body.internalId, // Your app's ID
      toastGuid: toastOrderGuid, // Toast's ID (Crucial for linking the webhook back)
      status: 'PREPARING'
    }
  }).promise();

  return { statusCode: 200, body: JSON.stringify({ success: true, toastGuid: toastOrderGuid }) };
};