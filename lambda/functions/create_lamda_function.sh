#!/bin/bash

# Check if a function name argument is provided
if [ -z "$1" ]; then
    echo "Error: No function name provided."
    echo "Usage: bash create_lambda.sh <function_name>"
    exit 1
fi

# Assign variables based on the function name argument and static settings
FUNCTION_NAME=$1
ZIP_FILE="${FUNCTION_NAME}.zip"
CODE_FILE="${FUNCTION_NAME}.js"
ROLE_ARN="arn:aws:iam::628677376833:role/fullAccess"  # Replace with your actual IAM role ARN
RUNTIME="nodejs18.x"
REGION="us-east-1"
HANDLER="${FUNCTION_NAME}.handler"  # The entry point function

# Check if the JavaScript file exists
if [ ! -f "$CODE_FILE" ]; then
    echo "Error: $CODE_FILE not found!"
    exit 1
fi

# Zip the code file
zip -r "$ZIP_FILE" "$CODE_FILE"
echo "Created $ZIP_FILE containing $CODE_FILE"

# Create the Lambda function with dynamic function name, handler, runtime, role, and region
aws lambda create-function \
  --function-name "$FUNCTION_NAME" \
  --runtime "$RUNTIME" \
  --role "$ROLE_ARN" \
  --handler "$HANDLER" \
  --zip-file "fileb://$ZIP_FILE" \
  --region "$REGION"

echo "Lambda function $FUNCTION_NAME created successfully in region $REGION."
