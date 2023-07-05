const Company = require('../models/companyModel')
const Package = require('../models/packageModel')
const messageModel = require('../models/messageModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET)
  }
  

//get all Companies
const getCompanies = async (req, res) => {
    try{
        const data = await Company.aggregate([
            {
                $lookup:{ 
                    from: 'packages', 
                    localField:'packageId', 
                    foreignField:'_id',
                    as:'packageDetail'}}
        ])
        return res.status(200).json({status:200,data:data});
    }catch(err) {
        return res.status(400).json({status:400, error:err});
    }
}

//get company Instance List
const getCompanyInstance = async (req, res) => {
    try{
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({status:404,error : 'No Data Found'})
        }
        let data = await Company.find({'_id':id})
        if (!data) {
            return res.status(404).json({status:404,error : 'No Data Found'})
        }
        return res.status(200).json({status:200,data:data})
    }catch(err) {
        return res.status(400).json({status:400,error:err});
    }
}

//Add New Company Instance
const addInstanceInCompany = async (req, res) => {
    try{
        const { companyId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(404).json({status: 400,error : 'Invalid Company Id'})
        }
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({status: 400,error : 'Record not found'})
        }

        const instances = company.instances;
        if(company.instances.length <= company.instanceAllowed) {
            let i = company.instances.length + 1;
            let a = company.instances.length;
            instances.push({name : 'user' + i, status: false})
            await Company.findOneAndUpdate({_id: company._id},{instances: instances})
            let Updatedcompany = await Company.findById(companyId);
            let userToken = await createToken(Updatedcompany.instances[a]._id)
            await Company.findOneAndUpdate(
                {'instances._id': Updatedcompany.instances[a]._id},                
                {'$set': {'instances.$.token': userToken}},
                {upsert: true, new: true }
            )
            return res.status(200).json({status:200,msg:'Instance Created Successfully'})
        }else{
            return res.status(400).json({status: 400,error : 'Your Instance creation limit is exceeded...'})
        }
        
    } catch (err) {
        return res.status(400).json({status: 400,error : err.message})
    }

    //console.log(instances);



}

//get single Company
const getCompany = async (req, res) => {
    try{
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({status:404,error : 'No Data Found'})
        }
        
        const data = await Company.aggregate([
            {$match:{ _id: new mongoose.Types.ObjectId(id)}},
            {
                $lookup:{ 
                    from: 'packages', 
                    localField:'packageId', 
                    foreignField:'_id',
                    as:'packageDetail'}
            },
            {
                $lookup:{ 
                    from: 'messages', 
                    localField:'_id', 
                    foreignField:'companyId',
                    as:'messageDetail'}
            }
        ])

        if (!data) {
            return res.status(404).json({status:404,error : 'No Data Found'})
        }
        return res.status(200).json({status:200,data:data})
    }catch(err) {
        return res.status(400).json({status:400,error:err});
    }

}

//get single company detail with user wise msg summary
const getCompanyDetailWithMsgSummary = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error : 'No Data Found'})
    }
    let result = await Company.find({'_id':id}) 
    // result = await Promise.all(result.map(async (data) => {
    //     data.users = await Promise.all(data.users.map(async (users) => {
    //         //console.log(users._id);
    //         //users._id = await messageModel.find({'userId':users._id}).exec();
    //         //return users
    //     }))
    //     return data
    // }))
    return res.status(200).json()
}

//create a new Company
const createCompany = async (req, res) => {
    const {name, instanceAllowed, packageId, allowedUrl, webhook, email, password, type} = req.body
    const emailExist = await User.findOne({ email: email });
    if (emailExist) {
        return res.status(400).json({
            status: 400,
            error: "Email already exists"
        });
    }
    let emptyFields = []
    let invalidUrls = []

    if (!name) {
        emptyFields.push('name')
    }
    if (!instanceAllowed) {
        emptyFields.push('instanceAllowed')
    }
    if (!packageId) {
        emptyFields.push('packageId')
    }
    if (!allowedUrl) {
        emptyFields.push('allowedUrl')
    }
    if (!webhook) {
        emptyFields.push('webhook')
    }
    
    if (!validator.isURL(webhook)) {
        invalidUrls.push('webhook')
    }
    if (!validator.isURL(allowedUrl)) {
        invalidUrls.push('allowedUrl')
    }

    if (emptyFields.length > 0) {
        return res.status(400).json({status: 400,error : 'Must be a valid URL', invalidUrls})
    }

    if (emptyFields.length > 0) {
        return res.status(400).json({status: 400,error : 'Please fill in all the fields', emptyFields})
    }

    if (!mongoose.Types.ObjectId.isValid(packageId)) {
        return res.status(404).json({status: 400,error : 'Invalid Package Id'})
    }

    const package = await Package.findById(packageId)

    if (!package) {
        return res.status(404).json({status: 400,error : 'Invalid Package Id'})
    }  

    const instances = []
    for ($i = 1; $i <= instanceAllowed; $i++) {
        instances.push({name : 'user' + $i, status: false})
    }
    try{
        const company = await Company.create({name, instanceAllowed, packageId, allowedUrl, webhook, status: 1, instances})
        const token = createToken(company._id)
        await Company.findOneAndUpdate({_id: company._id},{token: token})
        let Updatedcompany = null

        for (let i in company.instances) {
            let userToken = createToken(company.instances[i]._id)    
            Updatedcompany = await Company.findOneAndUpdate(
                {'instances._id': company.instances[i]._id},                
                {'$set': {'instances.$.token': userToken}},
                {upsert: true, new: true }
            )
        }
        User.signup(email, password, type, company._id)
        return res.status(200).json({status:200,msg:'Company Register Successfully'})
    } catch (err) {
        return res.status(400).json({status: 400,error : err.message})
    }
}

//delete a Company
const deleteCompany = async (req, res) => {
    const {id} = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error : 'No Data Found'})
    }

    const company = await Company.findOneAndDelete({_id: id})

    if (!company) {
        return res.status(404).json({error : 'No Data Found'})
    }    
    return res.status(200).json(company)

}

//update a Company
const updateCompany = async (req, res) => {
    const {id} = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error : 'No Data Found'})        
    }
    const company = await Company.findOneAndUpdate({_id: id},{
        ...req.body
    })

    if (!company) {
        return res.status(404).json({error : 'No Data Found'})
    }    
    return res.status(200).json(company)
}


module.exports = {
    createCompany,
    getCompanies,
    getCompany,
    deleteCompany,
    updateCompany,
    getCompanyDetailWithMsgSummary,
    getCompanyInstance,
    addInstanceInCompany
}