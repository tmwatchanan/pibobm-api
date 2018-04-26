var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('test_datum', new Schema({
    kinect: { type: Number, required: true },
    sequence: [
        { frame: { type: Number, required: true } },
        { string: { type: String, required: true, trim: true } },
        { timestamp: { type: Date, required: true } }
    ],
    created: { type: Date, default: Date.now },
}, { collection: 'test_data' }));
