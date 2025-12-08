import { OrderItem, UserInfo } from "../library/types";

//Define what payload looks like

export interface OrderPayload {
    user: UserInfo;
    cart: OrderItem[];
    total: number;
    paymentStatus: string;
    timestamp: string;
}

/**
 * Simulates sending an order to AWS API Gateway + Lambda.
 * Currently just logs to console and waits 1 second.
 */
export async function submitOrderToAWS(payload: OrderPayload): Promise<boolean> {
  // 1. Simulate network delay (1 second)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 2. Log the data so you can check it in Chrome DevTools
  console.log(" [MOCK AWS] Sending payload to DynamoDB:", payload);
  
  // 3. Return true to simulate a successful 200 OK response
  return true;
}