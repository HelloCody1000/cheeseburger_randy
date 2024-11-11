export const checkSubStatus = async (email) => {
    const params = {
        TableName: "clientSubStatus",
        Key: { email }
    };

    try {
        const result = await dynamodb.get(params).promise();
        return result.Item ? { ...result.Item, found: true } : { found: false };
    } catch (error) {
        console.error("Error retrieving subscription status:", error);
        throw error;
    }
};
