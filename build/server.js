'use strict';

var ip = require("ip");
var express = require('express');
var app = express();
var PORT = 8080;
var root = process.env.NODE_ENV === 'production' ? 'build' : 'src';

app.use(express.static(root));

app.get('/', function (req, resm, err) {
  res.sendFile('index.html', { root: root });
});

app.listen(process.env.PORT || PORT, function () {
  console.log('Server started on ' + ip.address() + ':' + (process.env.PORT || PORT));
});