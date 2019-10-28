const mongoose = require("mongoose");

const prescriptionSchema = mongoose.Schema({
    medicineId: { type: String, required: true },
    doctorId: { type: String, required: true },
    patientId: { type: String, required: true },
    dispensed: { type: Boolean, required: true }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
