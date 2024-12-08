import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// Initialize DynamoDB and SES clients
const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-east-1" }));
const ses = new SESClient({ region: "us-east-1" });

export const removeContactInfo = async (email) => {
    console.log(`Starting contact removal process for email: ${email}`);

    // Define parameters for DynamoDB row deletion
    const deleteParams = {
        TableName: "userSubStatus",
        Key: { email }
    };

    try {
        // Delete the contact row in DynamoDB
        await dynamodb.send(new DeleteCommand(deleteParams));
        console.log(`Successfully deleted contact row for email: ${email}`);
    } catch (error) {
        console.error("Error deleting contact from DynamoDB:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to remove contact information.", details: error.message })
        };
    }

    // Define email parameters
    const emailParams = {
        Destination: {
            ToAddresses: [email]
        },
        Message: {
            Body: {
                Text: {
                    Data: `Dear user,\n\nYour contact information has been successfully removed from the Smash Burger website. You will no longer receive any emails or communications from us.\n\nIf you have any questions, feel free to reach out to our support team.\n\nThank you!`
                }
            },
            Subject: {
                Data: "Confirmation: Contact Information Removed"
            }
        },
        Source: "your-verified-email@example.com" // Replace with your verified SES email address
    };

    try {
        // Send confirmation email via SES
        await ses.send(new SendEmailCommand(emailParams));
        console.log(`Confirmation email sent to: ${email}`);
    } catch (error) {
        console.error("Error sending confirmation email:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to send confirmation email.", details: error.message })
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Contact information removed and confirmation email sent." })
    };
};
