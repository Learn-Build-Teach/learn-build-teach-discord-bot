//run the twitch bot
import './bot.js';

//run the tweeter
import './tweeter.js';

// //run the express server
import express from 'express';
const app = express();

app.get('/ping', (req, res) => {
    console.log('Server was pinged');
    res.send('Hello World');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`listening on port, ${port}`);
});
