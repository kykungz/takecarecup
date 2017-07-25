'use strict';

var ip = require("ip");
var express = require('express');
var app = express();
var PORT = 3000;

app.use(express.static('src'));

app.use(function (req, res, next) {
  console.log('someone is coming');
  next();
});

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: 'src' });
});

app.listen(process.env.PORT || PORT, function () {
  console.log('Server started on ' + ip.address() + ':' + (process.env.PORT || PORT));
});