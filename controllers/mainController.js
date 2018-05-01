var mongoose = require('mongoose');
var TestData = require('../models/test-data');

exports.MockRealtimeData = function (req, res) {
    let testString = req.body.string;

    for (let kinect = 0; kinect < 3; kinect++) {
        let testList = [];
        let kinectIdx = 0;
        let frame = 1;
        for (let index = 0; index < testString.length; index += 2) {
            if (kinect == kinectIdx) {
                let frameObj = {
                    frame: frame,
                    symbol: testString.charAt(index) + testString.charAt(index + 1),
                    timestamp: 0
                }
                testList.push(frameObj);
                frame++;
            }
            kinectIdx = (kinectIdx + 1) % 3;
        }

        var query = {
            "second": req.body.second,
            "millisecond": req.body.millisecond,
            "kinect": kinect + 1
        },
        update = {
            "$set": {
                "sequence": testList
            }
        },
        options = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        };

        TestData.findOneAndUpdate(query, update, options,
            function (err, doc) {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Unable to add new realtime data!',
                        error: err,
                        data: req.body
                    });
                } else {

                }
            }
        );
    }
    return res.json({
        success: true,
        message: 'Realtime data has been added to the database',
        data: req.body
    });
};

exports.AddRealtimeData = function (req, res) {

    console.log(req.body.sequence);

    var query = {
        "second": req.body.second,
        "millisecond": req.body.millisecond,
        "kinect": req.body.kinect
    },
        update = {
            "$set": {
                "sequence": req.body.sequence
            }
        },
        options = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        };

    TestData.findOneAndUpdate(query, update, options,
        function (err, doc) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Unable to add new realtime data!',
                    error: err,
                    data: req.body
                });
            } else {
                return res.json({
                    success: true,
                    message: 'Realtime data has been added to the database',
                    data: req.body
                });
            }
        }
    );
};

function levenshtein_distance(a, b) {
    if (a.length == 0) return b.length;
    if (b.length == 0) return a.length;

    var matrix = [];

    // increment along the first column of each row
    var i;
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // increment each column in the first row
    var j;
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b[i - 1] == a[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1)); // deletion
            }
        }
    }
    return matrix[b.length][a.length];
}

exports.RetrieveRealtimeData = function (req, res) {
    TestData.find({
        'second': req.params.second,
        'millisecond': req.params.millisecond
    }, function (err, docs) {
        if (docs.length != 3 ||
            (docs[0].sequence.length != 45 && docs[1].sequence.length != 45 & docs[2].sequence.length != 45)) {
            return res.json({
                status: false,
                message: "docs.length = " + docs.length
            });
        } else {
            let sortedDocs = docs.sort(function (a, b) { return a.kinect - b.kinect; });
            let walkSequence = [];
            for (let f = 0; f < 45; f++) {
                for (let k = 0; k < 3; k++) {
                    walkSequence.push(docs[k].sequence[f].symbol);
                }
            }
            return res.json({
                status: true,
                string: walkSequence.join(""),
                sequence: walkSequence
            });
            // return res.json(sortedDocs);
        }
    });
};
