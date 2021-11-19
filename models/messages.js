const mongoose = require('mongoose');
const msgSchema = new mongoose.Schema({
    msg: {
        type: String,
        required: true
    }
})

const Message = mongoose.model('messages', msgSchema);
module.exports = Message;