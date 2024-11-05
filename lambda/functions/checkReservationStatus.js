import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' });
const dynamodb = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    const { time } = event;
    console.log("Checking reservation status for time:", time);

    // Define allowed letters for reservation slots
    const allowedLetters = ["A", "B", "C", "D", "E"];

    // Scan to find all reservations for the given time
    const scanParams = {
        TableName: 'Reservations',
        FilterExpression: "#t = :timeVal",
        ExpressionAttributeNames: {
            "#t": "time"  // Alias for 'time'
        },
        ExpressionAttributeValues: {
            ":timeVal": time
        }
    };

    try {
        // Execute the scan operation
        const existingReservations = await dynamodb.send(new ScanCommand(scanParams));
        console.log("Scan result:", existingReservations);

        // Collect letters of existing reservations
        const existingLetters = existingReservations.Items.map(item => item.reservationId.slice(-1));

        // Determine the first available letter in sequence
        const nextAvailableLetter = allowedLetters.find(letter => !existingLetters.includes(letter)) || null;
        console.log("Next available letter:", nextAvailableLetter);

        if (!nextAvailableLetter) {
            return {
                statusCode: 200,
                body: JSON.stringify({ isFull: true })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ nextAvailableLetter })
        };

    } catch (error) {
        console.error("Error querying DynamoDB:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error checking reservation status.', details: error.message })
        };
    }
};
