import { DynamoDBClient, GetCommand } from "@aws-sdk/client-dynamodb";
const dynamoClient = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {
    const { reservationId } = event;
    const params = {
        TableName: "Reservations",
        Key: { reservationId }
    };

    try {
        const result = await dynamoClient.send(new GetCommand(params));
        return {
            found: Boolean(result.Item),
            name: result.Item?.name,
            email: result.Item?.email
        };
    } catch (error) {
        console.error("Error finding reservation:", error);
        return { found: false };
    }
};
