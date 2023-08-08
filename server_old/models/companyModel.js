const mongoose = require('mongoose');

const Schema = mongoose.Schema

const instancesSchema = new mongoose.Schema({    
    name: {            
        type: String
    },
    phone: {            
        type: String,
        default: ''
    },
    token: {        
        type: String
    }, 
    status: {        
        type: Boolean,
    }   
})

const companySchema = Schema({
    name: {
        type: String,
        required: true
    },
    instanceAllowed: {
        type: Number,
        max: 5,
        required: true
    },
    packageId: {
        type: Schema.Types.ObjectId,
        ref: "Package",
        required: true
    },
    allowedUrl: {        
        type: String,
        required: true
    },
    webhook: {        
        type: String,
        required: true
    },
    token: {        
        type: String
    },
    status: {        
        type: Boolean,
        required: true
    },
    instances: [instancesSchema]

}, { timestamps : true})

module.exports = mongoose.model('company', companySchema)
