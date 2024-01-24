const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const assessmentSchema = new Schema({
    test_id: { type: Number, required: true },
    test_name: { type: String, required: true },
    test_description: { type: String, required: true },
    platform: { type: Schema.Types.ObjectId, ref: 'Platform', required: true }
});

const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;