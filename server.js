'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const routes = require('./routes');

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

MongoClient.connect(process.env.MONGOLAB_URI, (err, client) => {
  if (err) {
    console.err(`MongoClient connection error: ${err}`);
  }

  app.locals.db = client.db('freecodecamp');
  app.listen(process.env.PORT || 3000, () => {
    console.log('Node.js listening ...');
  });
});
