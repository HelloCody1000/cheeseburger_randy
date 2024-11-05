import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
const lambdaClient = new LambdaClient({ region: "us-east-1" });

export const handler = async (event) => {
    console.log("Received request:", JSON.stringify(event, null, 2));

    const { time, name, email, phone } = JSON.parse(event.body);

    // Step 1: Check availability by invoking checkReservationStatus Lambda function
    const checkParams = {
        FunctionName: "checkReservationStatus",
        Payload: JSON.stringify({ time })
    };

    let checkResponse;
    try {
        const checkResult = await lambdaClient.send(new InvokeCommand(checkParams));

        // Verify Payload exists before processing
        if (checkResult.Payload) {
            const payloadString = new TextDecoder().decode(checkResult.Payload);
            try {
                checkResponse = JSON.parse(payloadString);
                console.log("Parsed checkReservationStatus response:", checkResponse);
            } catch (parseError) {
                console.error("Error parsing checkReservationStatus response:", parseError);
                return {
                    statusCode: 500,
                    body: JSON.stringify({ error: "Error processing reservation.", details: "Invalid JSON response from checkReservationStatus" })
                };
            }
        } else {
            throw new Error("Received empty or invalid Payload from checkReservationStatus");
        }
    } catch (error) {
        console.error("Error invoking checkReservationStatus:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error processing reservation.", details: error.message })
        };
    }

    // Step 2: Check if response indicates full booking or error
    if (checkResponse.statusCode !== 200 || !checkResponse.body) {
        console.error("No available slots for the selected time.");
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Time slot is fully booked." })
        };
    }

    // Extract the next available letter from the response body
    const { nextAvailableLetter } = JSON.parse(checkResponse.body);
    if (!nextAvailableLetter) {
        console.error("No available slots for the selected time.");
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "No available slots for the selected time." })
        };
    }

    // Step 3: Invoke createReservation to book the slot
    const reservationParams = {
        FunctionName: "createReservation",
        Payload: JSON.stringify({
            time,
            nextAvailableLetter,
            name,
            email,
            phone
        })
    };

    let reservationResponse;
    try {
        const reservationResult = await lambdaClient.send(new InvokeCommand(reservationParams));
        reservationResponse = JSON.parse(new TextDecoder().decode(reservationResult.Payload));
        console.log("createReservation response:", reservationResponse);

        if (reservationResponse.statusCode !== 200) {
            throw new Error("Reservation creation failed");
        }
    } catch (error) {
        console.error("Error invoking createReservation:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error creating reservation.", details: error.message })
        };
    }

    // Define common parameters for notification functions
    const notificationData = {
        time,
        name,
        email,
        phone,
        reservationId: `${time}${nextAvailableLetter}`
    };

    // Step 4: Trigger both email and SMS notifications asynchronously
    const emailParams = {
        FunctionName: "emailConfirmation",
        Payload: JSON.stringify(notificationData)
    };
    const snsParams = {
        FunctionName: "sendSns",
        Payload: JSON.stringify(notificationData)
    };

    try {
        // Send email confirmation
        const emailPromise = lambdaClient.send(new InvokeCommand(emailParams));
        // Send SMS notification
        const snsPromise = lambdaClient.send(new InvokeCommand(snsParams));

        // Execute both asynchronously
        await Promise.all([emailPromise, snsPromise]);

        console.log("Both email and SMS notifications triggered successfully.");
    } catch (error) {
        console.error("Error triggering notifications:", error);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Reservation created successfully, but some notifications failed.",
                reservationId: `${time}${nextAvailableLetter}`
            })
        };
    }

    // Final response
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Reservation created successfully and notifications sent.",
            reservationId: `${time}${nextAvailableLetter}`
        })
    };
};
