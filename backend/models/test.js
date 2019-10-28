const mongoose = require("mongoose");

const testSchema = mongoose.Schema({
    testName: { type: String, required: true },
});

module.exports = mongoose.model('Test', testSchema);
