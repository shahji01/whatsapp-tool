const express = require('express')

const {requireMsgAuth, messageValidation} = require('../middleware/requireMsgAuth')

const {createMessage, updateMsgStatus, sendInstanceMessage, sendWebhookMessage, instanceWiseMsgList, sendImage} = require('../controllers/messageController')
 
const router = express.Router()

router.post('/updateMsgStatus', updateMsgStatus)
router.post('/sendInstanceMessage', sendInstanceMessage)
router.post('/sendWebhookMessage', sendWebhookMessage)
router.get('/instanceWiseMsgList', instanceWiseMsgList)
router.post('/send-image', sendImage)

router.use(requireMsgAuth)
router.use(messageValidation)

//POST a new Message
router.post('/', createMessage)



module.exports = router