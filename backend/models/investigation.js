const mongoose = require("mongoose");

const investigationSchema = mongoose.Schema({
    testId: { type: String, required: true },
    doctorId: { type: String, required: true },
    patientId: { type: String, required: true },
    done: { type: Boolean, required: true },
    results: {type: String, required: true}
});

module.exports = mongoose.model('Investigation', investigationSchema);
