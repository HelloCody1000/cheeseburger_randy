import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' });
const dynamodb = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    console.log("Raw event received by createReservation:", JSON.stringify(event, null, 2));

    // Parse event data with validation and logging
    let time, nextAvailableLetter, name, email, phone;
    try {
        // Destructure the event data, considering both stringified and JSON formats
        ({ time, nextAvailableLetter, name, email, phone } = 
            typeof event === "string" ? JSON.parse(event) : event);
    } catch (parseError) {
        console.error("Error parsing event data:", parseError);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid event data format.' })
        };
    }

    console.log("Parsed event data:", { time, nextAvailableLetter, name, email, phone });

    // Validate that nextAvailableLetter is present
    if (!nextAvailableLetter) {
        console.error("Missing 'nextAvailableLetter' in event data.");
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "No available slots for the selected time. 'nextAvailableLetter' is missing." })
        };
    }

    // Generate reservation ID
    const reservationId = `${time}${nextAvailableLetter}`;
    console.log("Generated reservationId:", reservationId);

    // Define DynamoDB put parameters
    const params = {
        TableName: 'Reservations',
        Item: {
            reservationId: reservationId,
            time: time,
            name: name,
            email: email,
            phone: phone,
            status: 'Confirmed'
        }
    };

    try {
        // Attempt to add the reservation to DynamoDB
        const result = await dynamodb.send(new PutCommand(params));
        console.log("DynamoDB put operation successful:", result);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Reservation created successfully.', reservationId })
        };
    } catch (error) {
        console.error("Error creating reservation in DynamoDB:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error creating reservation in DynamoDB.', details: error.message })
        };
    }
};
