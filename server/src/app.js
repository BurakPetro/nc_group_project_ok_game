const express = require('express');
const app = express();

const { getHello } = require('./controllers/controllers.js');

app.use(express.json());

app.get('/api/hello', getHello);

app.use((err, req, res, next) => {
  console.log(err, 'error in error handling block app.js');

  next(err);
});

module.exports = app;
