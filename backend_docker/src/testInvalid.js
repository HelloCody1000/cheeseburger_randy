const { handler } = require('./handler');

const invalidEvent = {
    body: JSON.stringify({
        name: "cody",
        phone: "1234567890",
        email: "codyfry@me.com",
        time: "invalid-date"
    })
};

handler(invalidEvent).then(response => {
    console.log(response);
});

