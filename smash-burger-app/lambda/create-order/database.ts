import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const saveOrderToDb = async (internalId: string, toastGuid: string) => {
  const tableName = process.env.TABLE_NAME;
  if (!tableName) throw new Error("TABLE_NAME missing");

  await docClient.send(new PutCommand({
    TableName: tableName,
    Item: {
      toastGuid: toastGuid,
      internalId: internalId,
      createdAt: new Date().toISOString(),
      status: 'SUBMITTED_TO_TOAST'
    },
  }));
  console.log(`Order saved: ${toastGuid}`);
};