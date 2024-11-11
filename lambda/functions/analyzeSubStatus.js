export const modifySubStatus = async (clientData, event) => {
    const updatedSendSns = event.sendSns !== undefined ? event.sendSns : clientData.sendSns;

    const params = {
        TableName: TABLE_NAME,
        Key: { email: clientData.email },
        UpdateExpression: "SET sendSns = :sns",
        ExpressionAttributeValues: { ":sns": updatedSendSns },
        ReturnValues: "ALL_NEW"
    };

    try {
        const result = await dynamodb.update(params).promise();
        return result.Attributes;
    } catch (error) {
        console.error("Error modifying subscription:", error);
        throw error;
    }
};
