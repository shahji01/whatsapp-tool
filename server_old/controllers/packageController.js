const Package = require('../models/packageModel')
const Company = require('../models/companyModel')
const mongoose = require('mongoose')
const {fsReadAndWrite, fsGetData, fsRemoveRecord, fsSingleDataById} = require('../helpers/commonFunction.js')
const path = './jsons/dbPackage.json'

//get all Packages
const getPackages = async (req, res) => {
    try{
        const packageList = await Package.find()
        return res.status(200).json({status:200,data:packageList});
    }catch(err) {
        return res.status(400).json({status:400,error:err});
    }
}

//get single Package
const getPackage = async (req, res) => {
    try {
        const {id} = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({error : 'No Data Found'})
        }

        const package = await Package.findById(id)
        const inrolComList = await Company.find({packageId: id});
        
        if (!package) {
            return res.status(404).json({status:404,error : 'No Data Found'})
        }    
        return res.status(200).json({status:200,data:{package,inrolComList}})
    }catch(err) {
        return res.status(400).json({status:400,error:err});
    }
    
}

//create a new Package
const createPackage = async (req, res) => {
    const {name, messagesAllowed, price, discount} = req.body
    const packageExist = await Package.findOne({ name: name });
    if (packageExist) {
        return res.status(400).json({
            status: 400,
            error: "Package Name already exists"
        });
    }
    let emptyFields = []

    if (!name) {
        emptyFields.push('name')
    }
    if (!messagesAllowed) {
        emptyFields.push('messagesAllowed')
    }
    if (!price) {
        emptyFields.push('price')
    }

    if (emptyFields.length > 0) {
        return res.status(400).json({error : 'Please fill in all the fields', emptyFields})
    }

    try{
        const package = await Package.create({name, messagesAllowed, price, discount})
        fsReadAndWrite(path, package)
        return res.status(200).json({status:200,msg:'Package Created Successfully'})
    } catch (err) {
        return res.status(400).json({error : err.message})
    }
}

//delete a Package
const deletePackage = async (req, res) => {
    const {id} = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error : 'No Data Found'})
    }

    const package = await Package.findOneAndDelete({_id: id})
    fsRemoveRecord(path,id)
    if (!package) {
        return res.status(404).json({error : 'No Data Found'})
    }    
    return res.status(200).json(package)
}

//update a Package
const updatePackage = async (req, res) => {
    const {id} = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error : 'No Data Found'})
    }
    const package = await Package.findOneAndUpdate({_id: id},{
        ...req.body
    })

    if (!package) {
        return res.status(404).json({error : 'No Data Found'})
    }    
    return res.status(200).json(package)
}


module.exports = {
    createPackage,
    getPackages,
    getPackage,
    deletePackage,
    updatePackage
}