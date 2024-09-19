import json
import boto3
from datetime import datetime, timedelta

def lambda_handler(event, context):
    # Parse input data
    data = json.loads(event['body'])
    date = data['date']
    time_slot = data['timeSlot']
    name = data['name']
    phone_number = data['phoneNumber']
    number_of_guests = data['numberOfGuests']

    # Initialize DynamoDB
    dynamo = boto3.resource('dynamodb')
    table = dynamo.Table('RestaurantReservations')

    # Check existing reservations count
    response = table.query(
        KeyConditionExpression='date = :date AND begins_with(timeSlot, :ts)',
        ExpressionAttributeValues={
            ':date': date,
            ':ts': time_slot
        }
    )
    current_count = sum(item['numberOfGuests'] for item in response['Items'])

    # Define the max capacity and reservable limits
    max_capacity = 60
    reservable_limit = 30

    if current_count + number_of_guests > reservable_limit:
        return {
            'statusCode': 400,
            'body': json.dumps('Reservation limit exceeded for this time slot')
        }
    
    # Add the reservation
    table.put_item(
        Item={
            'date': date,
            'timeSlot': time_slot,
            'name': name,
            'phoneNumber': phone_number,
            'numberOfGuests': number_of_guests,
            'reservationTime': datetime.now().isoformat()
        }
    )
    return {
        'statusCode': 200,
        'body': json.dumps('Reservation successful')
    }
