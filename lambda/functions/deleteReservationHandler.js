import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
const lambdaClient = new LambdaClient({ region: "us-east-1" });

export const handler = async (event) => {
    const { reservationId } = JSON.parse(event.body);
    console.log("Received delete request for reservation:", reservationId);

    // Step 1: Find the reservation to get additional details like email and name
    const findParams = {
        FunctionName: "findReservation",
        Payload: JSON.stringify({ reservationId })
    };
    let findResponse;
    try {
        const findResult = await lambdaClient.send(new InvokeCommand(findParams));
        findResponse = JSON.parse(new TextDecoder().decode(findResult.Payload));
        console.log("Find reservation response:", findResponse);
    } catch (error) {
        console.error("Error finding reservation:", error);
        return { statusCode: 500, body: JSON.stringify({ error: "Error finding reservation." }) };
    }

    // Check if reservation was found
    if (!findResponse || !findResponse.found) {
        return { statusCode: 404, body: JSON.stringify({ error: "Reservation not found." }) };
    }

    // Extract the necessary details for email notification
    const { email, name } = findResponse;

    // Step 2: Delete reservation
    const deleteParams = {
        FunctionName: "deleteReservation",
        Payload: JSON.stringify({ reservationId })
    };
    try {
        await lambdaClient.send(new InvokeCommand(deleteParams));
        console.log("Reservation deleted successfully:", reservationId);
    } catch (error) {
        console.error("Error deleting reservation:", error);
        return { statusCode: 500, body: JSON.stringify({ error: "Error deleting reservation." }) };
    }

    // Step 3: Send cancellation confirmation email
    const confirmDeleteParams = {
        FunctionName: "emailNotification",
        Payload: JSON.stringify({
            email,
            subject: "Reservation Cancellation Confirmation",
            messageBody: `
                Hello ${name},

                Your reservation (ID: ${reservationId}) has been successfully canceled.

                We hope to have the opportunity to serve you in the future.

                Best Regards,
                The Smash Burger Team
            `
        })
    };
    
    try {
        await lambdaClient.send(new InvokeCommand(confirmDeleteParams));
        console.log("Cancellation confirmation email sent successfully.");
    } catch (error) {
        console.error("Error sending cancellation confirmation email:", error);
        // If email fails, return a partial success response
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Reservation canceled successfully, but email notification failed."
            })
        };
    }

    // Final response indicating successful cancellation and email notification
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Reservation canceled successfully and confirmation email sent."
        })
    };
};
