export const makeNotificationSub = async (data) => {
    const params = {
        TableName: TABLE_NAME,
        Item: data
    };

    try {
        await dynamodb.put(params).promise();
        return { status: "Success", message: "Subscription created" };
    } catch (error) {
        console.error("Error creating subscription:", error);
        throw error;
    }
};
