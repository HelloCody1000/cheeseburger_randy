import { APIGatewayProxyHandler } from 'aws-lambda';
import { getToastToken, submitToastOrder } from './toast-service';
import { mapUserSelectionToToastPayload } from './menuMapper';
import { saveOrderToDb } from './database';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');

    // Step 1: Logic is hidden in this helper function
    const toastPayload = mapUserSelectionToToastPayload(body.items);

    // Step 2: Auth logic is hidden here
    const token = await getToastToken(); 

    // Step 3: API posting logic is hidden here
    const toastResponse = await submitToastOrder(token, toastPayload);

    // Step 4: Database logic is hidden here
    await saveOrderToDb(body.internalId, toastResponse.guid);

    return { 
      statusCode: 200, 
      body: JSON.stringify({ success: true, orderGuid: toastResponse.guid }) 
    };

  } catch (error) {
    console.error("Order failed:", error);
    return { statusCode: 500, body: 'Order Failed' };
  }
};