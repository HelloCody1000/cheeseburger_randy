const { scanReservations, putReservation } = require('./dynamodb');

const letters = 'ABCDEFGHI';

async function createReservation(data, reservationDateTime) {
    const reservationIdBase = formatReservationId(reservationDateTime);

    // Scan existing reservations
    const reservationCount = await scanReservations(reservationIdBase);

    if (reservationCount >= 10) {
        throw new Error('No more reservations available for this time.');
    }

    // Append the next available letter
    const reservationSuffix = letters[reservationCount];
    const reservationId = `${reservationIdBase}${reservationSuffix}`;

    // Insert new reservation
    await putReservation(reservationId, data);

    return reservationId;
}

function formatReservationId(reservationDateTime) {
    const year = reservationDateTime.getFullYear().toString();
    const month = (reservationDateTime.getMonth() + 1).toString().padStart(2, '0');
    const day = reservationDateTime.getDate().toString().padStart(2, '0');
    const hours = reservationDateTime.getHours().toString().padStart(2, '0');
    const minutes = reservationDateTime.getMinutes().toString().padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}`;
}

module.exports = { createReservation };
