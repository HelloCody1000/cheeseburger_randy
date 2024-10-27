const { DynamoDBClient, ScanCommand, PutItemCommand } = require('@aws-sdk/client-dynamodb');

const dynamoDB = new DynamoDBClient();

async function scanReservations(baseReservationId) {
    const scanParams = {
        TableName: 'Reservations',
        FilterExpression: 'begins_with(reservationId, :baseId)',
        ExpressionAttributeValues: {
            ':baseId': { S: baseReservationId }
        }
    };

    const scanCommand = new ScanCommand(scanParams);
    const scanResult = await dynamoDB.send(scanCommand);

    return scanResult.Items ? scanResult.Items.length : 0;
}

async function putReservation(reservationId, data) {
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
}

module.exports = { scanReservations, putReservation };
