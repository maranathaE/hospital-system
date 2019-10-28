const mongoose = require("mongoose");

const patientSchema = mongoose.Schema({
    name: { type: String, required: true },
    mothersName: { type: String, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    emergencyContact: { type: Object, required: true },
    phoneNumber: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    dateOfLastAdmission: { type: String, required: true },
    diagnoses: { type: Array, required: true }
});

module.exports = mongoose.model('Patient', patientSchema);
