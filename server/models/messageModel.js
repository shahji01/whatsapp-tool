const mongoose = require('mongoose')

const Schema = mongoose.Schema
//const moment = require('moment-timezone')
//const dateKarachi = moment.tz(Date.now(), "Asia/Karachi")
const messageSchema = Schema({    
    companyId: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    instanceId: {
        type: Schema.Types.ObjectId,
        ref: "Company.instances",
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    recipient: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    whatsappRefId: {
        type: String,
        required: false
    },
    userRefId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    webhookStatus: {
        type: String,
        required: true,
        default: 'false'
    },
}, { timestamps : true})

module.exports = mongoose.model('message', messageSchema)
