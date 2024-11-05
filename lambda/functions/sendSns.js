import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const snsClient = new SNSClient({ region: "us-east-1" });

export const handler = async (event) => {
    const { phone, message } = event;

    // Parameters for SNS to send SMS
    const params = {
        Message: message,
        PhoneNumber: phone,
    };

    try {
        const result = await snsClient.send(new PublishCommand(params));
        console.log("SNS SMS sent successfully:", result);
        return { statusCode: 200, body: JSON.stringify({ message: "SMS sent successfully" }) };
    } catch (error) {
        console.error("Error sending SMS via SNS:", error);
        return { statusCode: 500, body: JSON.stringify({ error: "Failed to send SMS" }) };
    }
};
