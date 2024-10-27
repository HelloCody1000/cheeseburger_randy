const { DynamoDBClient, ScanCommand, PutItemCommand } = require('@aws-sdk/client-dynamodb');

const dynamoDB = new DynamoDBClient({});

exports.handler = async (event) => {
    // Check if event.body is defined
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Request body is missing.' })
        };
    }

    const data = JSON.parse(event.body);

    // Validate and parse the time
    const reservationDateTime = new Date(data.time);
    
    if (isNaN(reservationDateTime.getTime())) {
        // If the time is invalid, return an error response
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid reservation time format.' })
        };
    }

    // Format the date and time as YYYYMMDDHHmm
    const year = reservationDateTime.getFullYear().toString();
    const month = (reservationDateTime.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = reservationDateTime.getDate().toString().padStart(2, '0');
    const hours = reservationDateTime.getHours().toString().padStart(2, '0');
    const minutes = reservationDateTime.getMinutes().toString().padStart(2, '0');

    // Combine date and time to form base reservationId
    const baseReservationId = `${year}${month}${day}${hours}${minutes}`;

    // Check existing reservations for this time (up to 10 using letters A-I)
    const scanParams = {
        TableName: 'Reservations',
        FilterExpression: 'begins_with(reservationId, :baseId)',
        ExpressionAttributeValues: {
            ':baseId': { S: baseReservationId }
        }
    };

    const scanCommand = new ScanCommand(scanParams);
    const scanResult = await dynamoDB.send(scanCommand);

    // Determine the next available suffix (A-I)
    const letters = 'ABCDEFGHI';
    const reservationCount = scanResult.Items ? scanResult.Items.length : 0;

    if (reservationCount >= 10) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'No more reservations available for this time.' })
        };
    }

    // Append the next available letter
    const reservationSuffix = letters[reservationCount];
    const reservationId = `${baseReservationId}${reservationSuffix}`;

    // DynamoDB PutItem parameters
    const params = {
        TableName: 'Reservations',
        Item: {
            reservationId: { S: reservationId }, // Using formatted date, time, and letter as reservationId
            name: { S: data.name },
            phone: { S: data.phone },
            email: { S: data.email },
            time: { S: data.time } // Original time as separate attribute
        }
    };

    const command = new PutItemCommand(params);
    await dynamoDB.send(command);

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Reservation added successfully', reservationId })
    };
};
