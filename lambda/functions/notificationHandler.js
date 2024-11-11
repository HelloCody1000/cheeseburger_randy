import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { sendNotification } from './sendNotification';
const lambdaClient = new LambdaClient({ region: "us-east-1" });

export const notificationHandler = async (event) => {
    const { email, phone, name, subject, messageBody } = JSON.parse(event.body);

    // Step 1: Check or create Subscription Status
    const checkParams = {
        FunctionName: "checkSubStatus",
        Payload: JSON.stringify({ email, phone })
    };
    let checkResponse;
    try {
        const checkResult = await lambdaClient.send(new InvokeCommand(checkParams));
        checkResponse = JSON.parse(new TextDecoder().decode(checkResult.Payload));

        if (!checkResponse.found) {
            console.log("Subscription not found, creating new subscription with email and SMS enabled.");
            const createParams = {
                FunctionName: "makeNotificationSub",
                Payload: JSON.stringify({
                    email,
                    phoneNumber: phone,
                    username: name,
                    SendEmail: true,
                    sendSns: true,
                    SendPromo: "both",
                    NoContact: false
                })
            };
            await lambdaClient.send(new InvokeCommand(createParams));
            checkResponse = { SendEmail: true, sendSns: true };
        }
    } catch (error) {
        console.error("Error checking or creating subscription status:", error);
        return { statusCode: 500, body: JSON.stringify({ error: "Error processing notification." }) };
    }

    // Step 2: Send Notification based on preferences
    try {
        await sendNotification(checkResponse, subject, messageBody);
        console.log("Notification sent successfully.");
    } catch (error) {
        console.error("Error sending notification:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error sending notification." })
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Notification processed successfully." })
    };
};
