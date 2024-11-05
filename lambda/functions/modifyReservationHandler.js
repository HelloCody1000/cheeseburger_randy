import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
const lambdaClient = new LambdaClient({ region: "us-east-1" });

export const handler = async (event) => {
    const { reservationId, newTime, name, email, phone } = JSON.parse(event.body);
    console.log("Received modify request:", { reservationId, newTime });

    // Step 1: Check if new time slot is available
    const checkParams = {
        FunctionName: "checkReservationStatus",
        Payload: JSON.stringify({ time: newTime })
    };
    const checkResult = await lambdaClient.send(new InvokeCommand(checkParams));
    const checkResponse = JSON.parse(new TextDecoder().decode(checkResult.Payload));

    if (checkResponse.isFull) {
        return { statusCode: 400, body: JSON.stringify({ error: "The new time slot is fully booked." }) };
    }

    // Step 2: Create new reservation for the new time
    const createParams = {
        FunctionName: "createReservation",
        Payload: JSON.stringify({ time: newTime, name, email, phone })
    };
    const createResult = await lambdaClient.send(new InvokeCommand(createParams));
    const createResponse = JSON.parse(new TextDecoder().decode(createResult.Payload));

    if (createResponse.statusCode !== 200) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error creating the modified reservation." })
        };
    }

    // Step 3: Delete old reservation
    const deleteParams = {
        FunctionName: "deleteReservationHandler",
        Payload: JSON.stringify({ reservationId })
    };
    const deleteResult = await lambdaClient.send(new InvokeCommand(deleteParams));
    const deleteResponse = JSON.parse(new TextDecoder().decode(deleteResult.Payload));

    if (deleteResponse.statusCode !== 200) {
        console.error("Error deleting old reservation:", deleteResponse);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error deleting the old reservation." })
        };
    }

    // Prepare notification details
    const notificationData = {
        email,
        phone,
        subject: "Reservation Modification Confirmation",
        messageBody: `
            Hello ${name},

            Your reservation has been updated successfully! Here are the new details:

            - Reservation ID: ${createResponse.reservationId}
            - New Date & Time: ${newTime}

            Thank you for choosing us! We look forward to serving you.

            Best Regards,
            The Smash Burger Team
        `
    };

    // Step 4: Send both email and SMS notifications asynchronously
    const emailParams = {
        FunctionName: "emailNotification",
        Payload: JSON.stringify(notificationData)
    };
    const smsParams = {
        FunctionName: "sendSns",
        Payload: JSON.stringify({
            phone,
            message: `Your reservation at Smash Burger has been updated to ${newTime}. Reservation ID: ${createResponse.reservationId}`
        })
    };

    try {
        // Trigger both email and SMS notifications
        const emailPromise = lambdaClient.send(new InvokeCommand(emailParams));
        const smsPromise = lambdaClient.send(new InvokeCommand(smsParams));

        await Promise.all([emailPromise, smsPromise]);
        console.log("Both email and SMS notifications triggered successfully for modified reservation.");
    } catch (error) {
        console.error("Error sending notifications:", error);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Reservation modified successfully, but notifications failed.",
                reservationId: createResponse.reservationId
            })
        };
    }

    // Final response
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Reservation modified successfully and notifications sent.",
            reservationId: createResponse.reservationId
        })
    };
};
