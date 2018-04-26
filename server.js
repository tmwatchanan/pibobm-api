var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
var moment = require('moment');

const bodyParser = require('body-parser'); // handling HTML body
var morgan = require('morgan'); // logging

// Local environment variables from a .env file -> process.env
require('dotenv').config()

var port = process.env.PORT || 5050; // process.env.PORT lets the port be set by Heroku

var MainController = require('./controllers/mainController');

// Allow CORS
var cors = require('cors');
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

// use body parser so we can get info from POST and/or URL params
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(morgan('dev'));
app.listen(app.get('port'), () => {
    console.log('Listening requests on port ' + port);
});

// ---------------------------------------------------------------------------------------------
var mongoose = require('mongoose');
var mongoDB = 'mongodb://' + process.env.mLabUser + ':' + process.env.mLabPassword + '@ds235708.mlab.com:35708/pibobm';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// ---------------------------------------------------------------------------------------------

app.post('/send-realtime', function (req, res) {
    var dateTimeString = moment(req.body.timestamp).format("DD-MM-YYYY HH:mm:ss");
    console.log("[" + dateTimeString + "][frame:" + req.body.frame +"][kinect:" + req.body.kinect + "] " + req.body.string);
    MainController.gotTestData(req, res);
    return res.json({
        server: "OK"
    });
});

app.listen(port, function () {
    console.log('Listening requests on port ' + port);
});
exports = module.exports = app;
