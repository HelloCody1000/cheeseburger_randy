const { DynamoDBClient, ScanCommand, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const dynamoDB = new DynamoDBClient({});

exports.handler = async (event) => {
    console.log("Received event:", event);
    if (!event.body) {
        return {
            statusCode: 400,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: 'Request body is missing.' })
        };
    }

    const data = JSON.parse(event.body);
    console.log("Parsed event body:", data);

    const reservationDateTime = new Date(data.time);
    if (isNaN(reservationDateTime.getTime())) {
        return {
            statusCode: 400,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: 'Invalid reservation time format.' })
        };
    }

    const year = reservationDateTime.getFullYear().toString();
    const month = (reservationDateTime.getMonth() + 1).toString().padStart(2, '0');
    const day = reservationDateTime.getDate().toString().padStart(2, '0');
    const hours = reservationDateTime.getHours().toString().padStart(2, '0');
    const minutes = reservationDateTime.getMinutes().toString().padStart(2, '0');
    const baseReservationId = `${year}${month}${day}${hours}${minutes}`;

    console.log("Generated base reservation ID:", baseReservationId);

    const scanParams = {
        TableName: 'Reservations',
        FilterExpression: 'begins_with(reservationId, :baseId)',
        ExpressionAttributeValues: {
            ':baseId': { S: baseReservationId }
        }
    };

    try {
        const scanCommand = new ScanCommand(scanParams);
        const scanResult = await dynamoDB.send(scanCommand);
        console.log("Scan result:", scanResult);

        const letters = 'ABCDEFGHI';
        const reservationCount = scanResult.Items ? scanResult.Items.length : 0;

        if (reservationCount >= 10) {
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ message: 'No more reservations available for this time.' })
            };
        }

        const reservationSuffix = letters[reservationCount];
        const reservationId = `${baseReservationId}${reservationSuffix}`;
        console.log("Generated reservation ID:", reservationId);

        const params = {
            TableName: 'Reservations',
            Item: {
                reservationId: { S: reservationId },
                name: { S: data.name },
                phone: { S: data.phone },
                email: { S: data.email },
                time: { S: data.time }
            }
        };

        const command = new PutItemCommand(params);
        await dynamoDB.send(command);
        console.log("Item inserted successfully into DynamoDB");

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: 'Reservation added successfully', reservationId })
        };
    } catch (error) {
        console.error("Error occurred while interacting with DynamoDB:", error);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: 'An error occurred.' })
        };
    }
};
