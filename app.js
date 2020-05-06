require('dotenv').config();
const app = require('express')();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then((result) => {
  const connection = result.connections[0];
  console.log('----- MongoDB Connected -----');
  console.log('Host:', connection.host);
  console.log('Database name:', connection.name);
  console.log('Port:', connection.port);
  console.log('-----------------------------');
})
.catch(e => console.log(e));

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));

app.use('/questions', require('./routes/questions'));
// app.use('/deputados', require('./routes/deputados'));
app.use('/voting', require('./routes/voting'));

app.listen(process.env.PORT);
