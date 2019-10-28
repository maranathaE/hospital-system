const mongoose = require("mongoose");

const medicineSchema = mongoose.Schema({
    medicineName: { type: String, required: true },
});

module.exports = mongoose.model('Medicine', medicineSchema);
