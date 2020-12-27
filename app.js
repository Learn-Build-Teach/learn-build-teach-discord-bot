const express = require('express');
const logger = require('./Logger');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    logger.info(`listening on port, ${port}`);
});
