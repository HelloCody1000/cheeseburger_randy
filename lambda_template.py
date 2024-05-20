import json

def lambda_handler(event, context):
    # Assuming the input is a JSON object passed from API Gateway with reservation details
    reservation_data = json.loads(event['body'])
    # Process reservation data
    print("Reservation request for:", reservation_data['name'])
    # Insert logic to store in a database, send notifications, etc.
    
    return {
        'statusCode': 200,
        'body': json.dumps('Reservation successful for ' + reservation_data['name'])
    }
