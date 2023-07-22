require('dotenv')
const jwt = require('jsonwebtoken');
const Company = require('../models/companyModel')
const messageModel = require('../models/messageModel')

const requireMsgAuth = async (req, res, next) => {
    const {authorization} = req.headers;
    if (!authorization) {
        return res.status(401).json({status:401,error:'Authorization token required...'})
    }
    const token = authorization.split(' ')[1]
    const requestUrl = req.get('host');
    try {
        const {_id} = jwt.verify(token, process.env.SECRET)
        const company = await Company.findOne({'instances._id':_id})
        if(company) {               
            company.instances.forEach(instance => {	
				if (instance._id == _id) {
                    if (requestUrl !== requestUrl) {
                        throw('URL Request is not Authorized..')
                    }
                    req.instance = {_id :instance._id, phone: instance.phone,companyId: company._id}
				}
			})
        } 
        next()           

    } catch (err) {
        console.log(err);
        res.status(401).json({status:401,error: 'Request is not Authorized'})
    }

} 

const messageValidation = async (req, res, next) => {
    try{
        let response = {}
        const  getCompanyAndPackageDetail = await Company.aggregate([
            {
                $match:{
                    'instances._id':{ $all: [req.instance._id]}
                }
            },
            {
                $lookup: {
                    from: "packages",
                    localField: "packageId",
                    foreignField: "_id",
                    as: "packageInfo"
                }
            }
        ]);
        const getInstanceWiseForwardMsgCount = await messageModel.countDocuments({'instanceId': req.instance._id});
        const remainingInstanceMsg = getCompanyAndPackageDetail[0].packageInfo[0].messagesAllowed - getInstanceWiseForwardMsgCount;
        var data = {
            'getInstavceWiseForwardMsgCount':getInstanceWiseForwardMsgCount,
            'remainingInstanceMsg':remainingInstanceMsg
        }
        response['data'] = data
        req.data = response;
        next()
    } catch {
        res.status(401).json({status:401,error: 'Something went wrong...'})
    }
}

module.exports = {
    requireMsgAuth,
    messageValidation
};