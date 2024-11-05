import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({ region: "us-east-1" });

export const handler = async (event) => {
    const { time, name, email, reservationId } = event;

    // Construct the email message
    const messageBody = `
        Hello ${name},

        Thank you for reserving with us! Here are your reservation details:

        - Reservation ID: ${reservationId}
        - Date & Time: ${time}

        If you need to make changes, please use the following links:

        - Modify your reservation: [Modify Reservation](https://your-api-url/modify?reservationId=${reservationId})
        - Cancel your reservation: [Cancel Reservation](https://your-api-url/cancel?reservationId=${reservationId})

        You can make changes up until the day of your reservation.

        Thank you for choosing us! We look forward to serving you.

        Best Regards,
        The Smash Burger Team
    `;

    const params = {
        Source: "otakugraphicshelp@gmail.com",  // Your verified SES sender email
        Destination: {
            ToAddresses: [email],
        },
        Message: {
            Subject: {
                Data: "Reservation Confirmation",
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
        console.log("Confirmation email sent successfully:", result);
        return { statusCode: 200, body: JSON.stringify({ message: "Confirmation email sent." }) };
    } catch (error) {
        console.error("Error sending confirmation email:", error);
        return { statusCode: 500, body: JSON.stringify({ error: "Error sending confirmation email." }) };
    }
};
