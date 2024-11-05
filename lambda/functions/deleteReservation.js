import { DynamoDBClient, DeleteCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {
    const { reservationId } = JSON.parse(event.body);

    const params = {
        TableName: "Reservations",
        Key: { reservationId },
    };

    try {
        await client.send(new DeleteCommand(params));
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Reservation canceled successfully." }),
        };
    } catch (error) {
        console.error("Error canceling reservation:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error canceling reservation." }),
        };
    }
};
