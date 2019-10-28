const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    // senderId: { type: String, required: true },
    // receiverId: { type: String, required: true },
    // message: { type: String, required: true }
    staffs: { type: Array, required: true },
    texts: { type: Array, required: true }
});

module.exports = mongoose.model('Message', messageSchema);
