require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./api');

const app = express();
app.use(bodyParser.json());

app.use('/api', apiRouter);
app.use(express.static('www'));

app.listen(process.env.PORT || 8000);
