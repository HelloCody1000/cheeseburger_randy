import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({ region: "us-east-1" });

export const handler = async (event) => {
    const { email, subject, messageBody } = event;

    const params = {
        Source: "otakugraphicshelp@gmail.com",  // Your verified SES sender email
        Destination: {
            ToAddresses: [email],
        },
        Message: {
            Subject: {
                Data: subject,
            },
            Body: {
                Text: {
                    Data: messageBody,
                },
            },
        },
    };

    // Send email via SES
    try {
        const result = await sesClient.send(new SendEmailCommand(params));
        console.log("Notification email sent successfully:", result);
        return { statusCode: 200, body: JSON.stringify({ message: "Notification email sent." }) };
    } catch (error) {
        console.error("Error sending notification email:", error);
        return { statusCode: 500, body: JSON.stringify({ error: "Error sending notification email." }) };
    }
};
