const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.get('/', (req,res) => {
//   res.send("oiee");
// });

// import all the controller which is create into folder controllers
require('./app/controllers/index')(app);

app.listen(9000);