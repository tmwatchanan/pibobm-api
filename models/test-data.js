var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('test_datum', new Schema({
    second: { type: Number, required: true },
    millisecond: { type: Number, required: true },
    kinect: { type: Number, required: true },
    sequence: [
        {
            frame: { type: Number, required: true },
            symbol: { type: String, required: true, trim: true },
            timestamp: { type: Date, required: true }
        }
    ],
    created: { type: Date, default: Date.now },
}, { collection: 'test_data' }));
