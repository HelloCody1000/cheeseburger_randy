import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const sesClient = new SESClient({ region: "us-east-1" });
const snsClient = new SNSClient({ region: "us-east-1" });

export const sendNotification = async (clientData, subject, messageBody) => {
    const { email, phoneNumber, SendEmail, sendSns } = clientData;
    let notificationResults = [];

    if (SendEmail) {
        const emailParams = {
            Source: "otakugraphicshelp@gmail.com",
            Destination: { ToAddresses: [email] },
            Message: {
                Subject: { Data: subject },
                Body: { Text: { Data: messageBody } }
            }
        };
        try {
            const emailResult = await sesClient.send(new SendEmailCommand(emailParams));
            notificationResults.push("Email sent");
        } catch (error) {
            console.error("Error sending email:", error);
            notificationResults.push("Email failed");
        }
    }

    if (sendSns) {
        const smsParams = { Message: messageBody, PhoneNumber: phoneNumber };
        try {
            const smsResult = await snsClient.send(new PublishCommand(smsParams));
            notificationResults.push("SMS sent");
        } catch (error) {
            console.error("Error sending SMS:", error);
            notificationResults.push("SMS failed");
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ results: notificationResults })
    };
};
