const mongoose = require('mongoose')

const Schema = mongoose.Schema

const packageSchema = Schema({
    name: {
        type: String,
        required: true
    },
    messagesAllowed: {
        type: Number,
        max: 30000,
        required: true
    },
    price: { 
        monthly: {            
            type: Number,
            required: true
        },    
        quaterly: {            
            type: Number,
            required: true
        },  
        halfyearly: {            
            type: Number,
            required: true
        },
        yearly: {            
            type: Number,
            required: true
        } 
    },
    discount: { 
        monthly: {            
            type: Number,
            required: true
        },    
        quaterly: {            
            type: Number,
            required: true
        },  
        halfyearly: {            
            type: Number,
            required: true
        },
        yearly: {            
            type: Number,
            required: true
        } 
    }
}, { timestamps : true})

module.exports = mongoose.model('package', packageSchema)
