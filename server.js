var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
var moment = require('moment');
var csv = require("csvtojson");

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
app.listen(port, () => {
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

app.get('/', function (req, res) {
    return res.json({
        endpoint: "/"
    });
});


app.post('/send-realtime', function (req, res) {
    // var dateTimeString = moment(req.body.timestamp).format("DD-MM-YYYY HH:mm:ss");
    console.log("[" + Date.now() + "] received data from kinect " + req.body.kinect);
    MainController.AddRealtimeData(req, res);
    // return res.json({
    //     endpoint: "/send-realtime",
    //     data: req.body
    // });
});

app.get('/get-realtime/:second/:millisecond/:filename', function (req, res) {
    console.log("[" + Date.now() + "] get data at " + req.params.second + "." + req.params.millisecond + " from all 3 kinects with " + req.params.filename);
    csv({
        noheader: true,
        headers: ['no', 'name', 'status', 'string']
    })
        .fromFile("./data/" + req.params.filename + ".csv")
        .on("end_parsed", function (stringPrototypes) {
            // console.log(stringPrototypes);
            // return res.json(stringPrototypes);
            MainController.RetrieveRealtimeData(req, res, stringPrototypes);
        });
    // return res.json({
    //     endpoint: "/get-realtime",
    // });
});

app.post('/mock-realtime', function (req, res) {
    // var dateTimeString = moment(req.body.timestamp).format("DD-MM-YYYY HH:mm:ss");
    console.log("[" + Date.now() + "] mock data.");
    MainController.MockRealtimeData(req, res);
    // return res.json({
    //     endpoint: "/send-realtime",
    //     data: req.body
    // });
});

app.get('/csv-to-json/:filename', function (req, res) {
    console.log("[" + Date.now() + "] convert " + req.params.filename + ".csv to json.");
    csv({
        noheader: true,
        headers: ['no', 'name', 'status', 'string']
    })
        .fromFile("./data/" + req.params.filename + ".csv")
        .on("end_parsed", function (jsonArrayObj) {
            // console.log(jsonArrayObj);
            return res.json(jsonArrayObj);
        });
});

exports = module.exports = app;
