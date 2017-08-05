"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var env = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 8080;
if (env === 'development') {
    app.use(errorHandler());
}
else if (env === 'production') {
}
app.get('/', function (req, res) {
    res.json('Hallo');
});
app.listen(port, function () {
    console.log('Demo Express server listening on port %d in %s mode', port, app.settings.env);
});
