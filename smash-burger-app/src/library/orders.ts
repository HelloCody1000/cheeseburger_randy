import { OrderItem, UserInfo } from "../library/types";

interface OrderPayload {
  user: UserInfo;
  cart: OrderItem[];
  total: number;
  paymentStatus: string;
  timestamp: string;
}

/**
 * Simulates sending an order to AWS API Gateway + Lambda
 * In the future, this will use fetch() or axios to hit your real endpoint.
 */
export async function submitOrderToAWS(payload: OrderPayload): Promise<boolean> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log("[AWS SDK] Sending payload to DynamoDB:", payload);
  
  // Return true to simulate success
  return true;