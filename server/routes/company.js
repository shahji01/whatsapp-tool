const express = require('express')

const {
    createCompany,
    getCompanies,
    getCompany,
    deleteCompany,
    updateCompany,
    getCompanyDetailWithMsgSummary,
    getCompanyInstance,
    addInstanceInCompany
} = require('../controllers/companyController')
 
const router = express.Router()

//router.use(requireAuth)

//GET all Company
router.get('/', getCompanies)

//GET All Company Instance
router.get('/companyInstance/:id', getCompanyInstance)

//Add New Instance In Company
router.post('/addInstance', addInstanceInCompany)

//GET single Company
router.get('/:id', getCompany)

//POST a new Company
router.post('/', createCompany)

//DELETE single Company
router.delete('/:id', deleteCompany)

//UPDATE single Company 
router.patch('/:id', updateCompany)

//Get Company Detail With Msg Summary
router.get('/getDetailWithMsgSummary/:id', getCompanyDetailWithMsgSummary)


module.exports = router