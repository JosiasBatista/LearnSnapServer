const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.send('Hello world!'));

app.listen(port, () => console.log(`Running on ${port}`))