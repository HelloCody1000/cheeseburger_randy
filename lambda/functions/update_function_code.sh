#!/bin/bash

# Check if a function name argument is provided
if [ -z "$1" ]; then
    echo "Error: No function name provided."
    echo "Usage: bash update_lambda.sh <function_name>"
    exit 1
fi

FUNCTION_NAME=$1
ZIP_FILE="${FUNCTION_NAME}.zip"
CODE_FILE="${FUNCTION_NAME}.js"

# Zip the code file
if [ -f "$CODE_FILE" ]; then
    zip -r "$ZIP_FILE" "$CODE_FILE"
    echo "Created $ZIP_FILE containing $CODE_FILE"
else
    echo "Error: $CODE_FILE not found!"
    exit 1
fi

# Update the Lambda function code
aws lambda update-function-code \
    --function-name "$FUNCTION_NAME" \
    --zip-file "fileb://$ZIP_FILE" \
    --region us-east-1

echo "Updated Lambda function: $FUNCTION_NAME"
