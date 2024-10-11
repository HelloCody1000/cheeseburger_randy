const { handler } = require('./handler');

const event = {
    body: JSON.stringify({
        name: "John Doe",
        phone: "1234567890",
        email: "johndoe@example.com",
        time: "2024-10-08T15:30:00Z"
    })
};

handler(event).then(response => {
    console.log(response);
});
