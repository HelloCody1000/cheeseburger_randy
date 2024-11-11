export const deleteSubStatus = async (email) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { email }
    };

    try {
        await dynamodb.delete(params).promise();
        console.log("Subscription successfully deleted.");
    } catch (error) {
        console.error("Error deleting subscription:", error);
        throw error;
    }
};
