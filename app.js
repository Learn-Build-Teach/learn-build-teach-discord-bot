const express = require('express');
const app = express();

app.get('/ping', (req, res) => {
    console.log('Server was pinged');
    res.send('Hello World');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`listening on port, ${port}`);
});
