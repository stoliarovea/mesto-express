const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/users');
const cards = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('MongoDB - Ok');
  })
  .catch((err) => {
    console.log(err);
  });

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '647b26d2fc4d7d8d3f374fc2'
  };

  next();
});

app.use(users);

app.use(cards);

app.use((req, res) => {
  res.status(404).send({ message: "Page not found" })
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});
