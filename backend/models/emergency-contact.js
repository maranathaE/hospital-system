const mongoose = require("mongoose");

const emergencyContactSchema = mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
});

module.exports = mongoose.model('EmergencyContact', emergencyContactSchema);
