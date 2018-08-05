require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./api');
const port = process.env.PORT || 8000;

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use('/api', apiRouter);
app.use(express.static(
  path.join(__dirname, '../www')
));

app.listen(port);
console.log(`Server listening on http://localhost:${port}/`);
