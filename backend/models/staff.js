const mongoose = require("mongoose");

const staffSchema = mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    role: { type: String, required: true },
    active: { type: Boolean, required: true },
    admin: { type: Boolean, required: true }
});

module.exports = mongoose.model('Staff', staffSchema);
