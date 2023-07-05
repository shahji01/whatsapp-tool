const express = require('express')
const {requireMsgAuth} = require('../middleware/requireMsgAuth')
const {createGroup, groupList, sendMsgGroup, addParticipantInGroup, removeParticipantInGroup, removeGroup} = require('../controllers/groupController')
 
const router = express.Router()
router.post('/create-group',requireMsgAuth, createGroup)
router.get('/group-list',requireMsgAuth, groupList)

router.post('/send-msg-group/:groupName',requireMsgAuth, sendMsgGroup);
router.post('/add-participant-in-group',requireMsgAuth, addParticipantInGroup)
router.post('/remove-participant-in-group',requireMsgAuth, removeParticipantInGroup)
router.patch('/remove-group',requireMsgAuth,removeGroup)

module.exports = router