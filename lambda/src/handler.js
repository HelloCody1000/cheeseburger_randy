const { createReservation } = require('./src/reservation.js');
const { validateRequestBody, validateReservationTime } = require('./src/validation.js');

exports.handler = async (event) => {
    // Validate request body
    if (!validateRequestBody(event.body)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Request body is missing.' })
        };
    }

    const data = JSON.parse(event.body);

    // Validate and parse reservation time
    const reservationDateTime = validateReservationTime(data.time);
    if (!reservationDateTime) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid reservation time format.' })
        };
    }

    try {
        // Create the reservation and return success
        const reservationId = await createReservation(data, reservationDateTime);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Reservation added successfully', reservationId })
        };
    } catch (error) {
        console.error("Error occurred:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'An error occurred.' })
        };
    }
};
