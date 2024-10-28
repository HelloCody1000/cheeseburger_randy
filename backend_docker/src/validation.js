function validateRequestBody(body) {
    return body !== undefined && body !== null;
}

function validateReservationTime(time) {
    const reservationDateTime = new Date(time);
    return isNaN(reservationDateTime.getTime()) ? null : reservationDateTime;
}

module.exports = { validateRequestBody, validateReservationTime };
