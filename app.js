//run the twitch bot
require('./bot');

//run the tweeter
require('./tweeter');

//run the express server
const express = require('express');
const app = express();

app.post('/ping', (req, res) => {
    console.log('Server was pinged');
    res.send('Hello World');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`listening on port, ${port}`);
});
