import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

// Initialize DynamoDB client
const client = new DynamoDBClient({ region: 'us-east-1' });
const dynamodb = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    console.log("Raw event received by checkSubStatus:", JSON.stringify(event, null, 2));

    let email;
    try {
        // Parse the event data
        email = typeof event === "string" ? JSON.parse(event).email : event.email;
    } catch (parseError) {
        console.error("Error parsing event data:", parseError);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid event data format.' })
        };
    }

    if (!email) {
        console.error("Missing 'email' in event data.");
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "The 'email' field is required." })
        };
    }

    console.log("Checking subscription status for email:", email);

    // Define DynamoDB get parameters
    const params = {
        TableName: 'userSubStatus',
        Key: { email }
    };

    try {
        // Retrieve the user's subscription status
        const result = await dynamodb.send(new GetCommand(params));
        console.log("DynamoDB get operation result:", result);

        if (!result.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Subscription status not found." })
            };
        }

        const { noContact, sendEmail, sendSns, sendPromo, phoneNumber } = result.Item;

        if (noContact) {
            console.log("User has 'noContact' set to true. Removing contact info...");
            await removeContactInfo(email);
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Contact information removed due to 'noContact'." })
            };
        }

        if (sendPromo) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    type: "sendPromo",
                    email: sendEmail ? email : null,
                    phone: sendSns ? phoneNumber : null,
                    sendPromo: true
                })
            };
        }

        if (sendEmail) {
            return {
                statusCode: 200,
                body: JSON.stringify({ type: "sendEmail", value: email })
            };
        }

        if (sendSns) {
            return {
                statusCode: 200,
                body: JSON.stringify({ type: "sendSns", value: phoneNumber })
            };
        }

        // If all preferences are false, set noContact to true
        console.log("All preferences are false. Updating 'noContact' to true.");
        const updateParams = {
            TableName: 'userSubStatus',
            Key: { email },
            UpdateExpression: "SET noContact = :trueVal",
            ExpressionAttributeValues: {
                ":trueVal": true
            }
        };

        await dynamodb.send(new UpdateCommand(updateParams));
        await removeContactInfo(email);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "All preferences were false. 'noContact' set to true and contact information removed."
            })
        };

    } catch (error) {
        console.error("Error interacting with DynamoDB:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error retrieving or updating subscription status.', details: error.message })
        };
    }
};

// Dummy removeContactInfo function (replace with actual implementation)
const removeContactInfo = async (email) => {
    console.log(`Simulating removal of contact info for email: ${email}`);
    // Add actual implementation here
};
