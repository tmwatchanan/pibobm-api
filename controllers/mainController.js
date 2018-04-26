var mongoose = require('mongoose');
var TestData = require('../models/test-data');

exports.addNewUser = function (req, res) {
    var newFrame = new TestData({
        frame: req.body.frame,
        kinect: req.body.kinect,
        string: req.body.string,
        timestamp: req.body.timestamp
    });
    TestData.save(function (err, frame) {
        if (err) {
            return res.json({
                success: false,
                message: 'Unable to add new frame!',
                frame: newFrame.frame,
                kinect: newFrame.kinect,
                string: newFrame.string,
                timestamp: newFrame.timestamp
            });
        } else {
            return res.json({
                success: true,
                message: 'New user has been created',
                user: {
                    id: newFrame.id,
                    name: newFrame.name,
                    email: newFrame.email
                }
            });
        }
    });
};

exports.gotTestData = function (req, res) {
    var query = { id: req.body.id },
        update = { token: req.body.token, results: req.body.results, updated: Date.now() },
        options = { upsert: true, new: true, setDefaultsOnInsert: true };

    // Find the document
    TestData.findOneAndUpdate(query, update, options, function (error, document) {
        if (error) return;

        // do something with the document
        document.count = document.count + 1;
        document.save();
        // return res.json({
        //     server: "OK",
        //     id: req.body.id,
        //     token: req.body.token,
        //     results: req.body.results
        // });
    });
};
