const express = require('express')

const {
    createPackage,
    getPackages,
    getPackage,
    deletePackage,
    updatePackage
} = require('../controllers/packageController')
 
const router = express.Router()

//router.use(requireAuth)

//GET all Packages
router.get('/', getPackages)

//GET single Package
router.get('/:id', getPackage)

//POST a new Package
router.post('/', createPackage)

//DELETE single Package
router.delete('/:id', deletePackage)

//UPDATE single Package 
router.patch('/:id', updatePackage)

module.exports = router