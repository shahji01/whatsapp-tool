const { phoneNumberFormatter,compareDate } = require('../helpers/formatter')
const messageModel = require('../models/messageModel')
const {fsReadAndWrite} = require('../helpers/commonFunction.js')
const { log } = require('console');
const companyModel = require('../models/companyModel');
const path = './jsons/dbMessage.json'

const sendImage = async (req, res) => {
    return console.log(req.body);
    /*const client = global.session.find(sess => sess.id == req.user._id)?.client
    console.log(req.user._id);
    const number = phoneNumberFormatter(req.body.id)
    console.log(number);
    const isRegisteredNumber = await client.isRegisteredUser(number)
    console.log(isRegisteredNumber);
    return console.log(client);
    const data = await client.sendMediaFile(
        req.body.id,
        req.file,
        'image',
        req.body?.caption
    )
    return res.status(201).json({ error: false, data: data })*/
}

// const createMessage = async (req, res) => {
//     try{
//         let msgArray = [];
//         let msgResult = [];
//         const messageData = req.body

//         if (messageData.length == undefined) {
//             msgArray.push(messageData);
//         } else {
//             msgArray = messageData;
//         }
//         for (let valofmsgarray of msgArray) {
//             const {recipient, message, referenceNumber} = valofmsgarray
            
//             let emptyFields = []

//             if (!recipient) {
//                 emptyFields.push('recipient')
//             }
            
//             if (!message) {
//                 emptyFields.push('messages')
//             }
//             if (!referenceNumber) {
//                 emptyFields.push('referenceNumber')
//             }

//             if (emptyFields.length > 0) {
//                 return res.status(400).json({status:400,error : 'Please fill in all the fields', emptyFields})
//             }
//             if(req.data.data.remainingInstanceMsg == 0){
//                 return res.status(400).json({status:400,error : 'Something Went Wrong! Your msg limit is exceed plz upgrade your package'})
//             }else{
                
//                 // const lastForwardMsgDetail = await messageModel.findOne(
//                 //     {'userId': req.user._id}
//                 // ).sort({_id:-1})
//                 // let date_ob = new Date();
                
//                 // if(lastForwardMsgDetail != null){
//                 //     let dateTimeValidate = compareDate(lastForwardMsgDetail.createdAt,date_ob)
//                 //     if(dateTimeValidate == 'false'){
//                 //         return res.status(400).json({error : 'Something went wrong!'})
//                 //     }
//                 // }
                

//                 const client = global.session.find(sess => sess.id == req.instance._id)?.client
//                 const number = phoneNumberFormatter(recipient)
//                 try {
//                     const isRegisteredNumber = await client.isRegisteredUser(number)
//                     if(isRegisteredNumber){
//                         const response = await messageModel.create({companyId: req.instance.companyId, instanceId: req.instance._id, sender: req.instance.phone, recipient, message , userRefId: referenceNumber,whatsappRefId: '' , status: 'Pending'})
//                         msgResult.push(response)
//                         //return res.status(200).json({id: response._id, referenceNumber: referenceNumber, status: 'Pending'})
//                     } else{ 
//                         return res.status(400).json({status:400,error: 'The number is not registered'})
//                     }  
//                 } catch (err) {
//                     return res.status(400).json({status:400,error : 'Please try again once the whatsapp status is ready'})
//                 }
//             }
//         }
//         res.status(200).json({status:200,data:msgResult})
//     }catch (err) {
//         return res.status(400).json({status:400,error:err});
//     }
// }

const createMessage = async (req, res) => {
    try{
        let msgResult = [];
        const {recipient} = req.body
        var recipientArr = recipient.split(',');

        let emptyFields = []

        if (!recipient) {
            emptyFields.push('recipient')
        }
        
        for (let valofrecipientarr of recipientArr){
            const {message, referenceNumber} = req.body
            if (!message) {
                emptyFields.push('messages')
            }
            if (!referenceNumber) {
                emptyFields.push('referenceNumber')
            }

            if (emptyFields.length > 0) {
                return res.status(400).json({status:400,error : 'Please fill in all the fields', emptyFields})
            }
            if(req.data.data.remainingInstanceMsg == 0){
                return res.status(400).json({status:400,error : 'Something Went Wrong! Your msg limit is exceed plz upgrade your package'})
            }else{
                const client = await global.session.find(sess => sess.id == req.instance._id)?.client
                const number = phoneNumberFormatter(valofrecipientarr)
                try {
                    const isRegisteredNumber = await client.isRegisteredUser(number)
                    if(isRegisteredNumber){
                        const response = await messageModel.create({companyId: req.instance.companyId, instanceId: req.instance._id, sender: req.instance.phone, recipient:valofrecipientarr, message:message , userRefId: referenceNumber,whatsappRefId: '' , status: 'Pending'})
                        msgResult.push(response)
                    } else{ 
                        return res.status(400).json({status:400,error: 'The number is not registered'})
                    }  
                } catch (err) {
                    return res.status(400).json({status:400,error : 'Please try again once the whatsapp status is ready'})
                }
            }

        }

        res.status(200).json({status:200,data:msgResult})
    }catch (err) {
        return res.status(400).json({status:400,error:err});
    }
}

async function instancePendingMsg (columnName,type){
    const getInstancePendingMsg = await messageModel.aggregate([
        {
            $match: {[columnName]: type}
        },
        {
          $group: {
            _id: "$instanceId",
            doc: {$first: "$$ROOT"},
          }
        },
        {
          $replaceRoot: {newRoot: "$doc"}
        }
      ]);
      return getInstancePendingMsg;
}

async function insertMessage(response,msgId) {            
    const whatsappId = response.id.id
    const WhatsappStatus = waStatus(response.ack)
    try{
        await messageModel.findByIdAndUpdate(msgId, { status: WhatsappStatus,whatsappRefId:whatsappId,webhookStatus:'false' });    
        console.log('Success');
    } catch (err) {
        console.log(err);
    }
}

const sendInstanceMessage = async () => {
    try{
        const getInstancePendingMsg = await instancePendingMsg('status','Pending');
       if(getInstancePendingMsg.length !== 0){
            getInstancePendingMsg.forEach(msgDetail => {
                const client = global.session.find(sess => sess.id == msgDetail.instanceId)?.client
                const number = phoneNumberFormatter(msgDetail.recipient)
                client.sendMessage(number, msgDetail.message).then(response => {
                    insertMessage(response,msgDetail._id);
                }).catch(err => {   
                    console.log(err);
                })
            });
            console.log('Run Send Instance Msg');
        }
        
    } catch (err){
        console.log({error : 'Something went Wrong! Please try again'});
    }
}

const sendWebhookMessage = async () => {
    let updateWebHookRes = []
    try{
        const pendingWebHookMsg = await instancePendingMsg('webhookStatus','false')
        if(pendingWebHookMsg.length !== 0){
            for (let valofwebhookmsg of pendingWebHookMsg) {
                const updateMsgStatus = await messageModel.findOneAndUpdate({whatsappRefId: valofwebhookmsg.whatsappRefId},{webhookStatus:'true'})        
                updateWebHookRes.push(updateMsgStatus)
                fsReadAndWrite(path, updateMsgStatus)
            }
            console.log('Run WebHook')
        }
    } catch (err){
        console.log(err)
    }
}

const updateMsgStatus = async (req, res) => {
    const {id, referenceNumber, status} = req.body;
    const WhatsappStatus = waStatus(status);
    const updateMsgStatus = await messageModel.findOneAndUpdate({whatsappRefId: id},{status: WhatsappStatus,webhookStatus:'false'})
    return res.status(200).json(updateMsgStatus)
}

const instanceWiseMsgList = async (req, res) => {
    try{

        const {authorization} = req.headers;
        if (!authorization) {
            return res.status(401).json({status:401,error:'Authorization token required...'})
        }
        const token = authorization.split(' ')[1]
        const getInstanceDetail = await companyModel.find({'instances.token' : token});
        var result = await getInstanceDetail[0].instances?.find(item => item.token === token);
        const instanceId = result._id;
        const data = await messageModel.find({'instanceId':instanceId})
        return res.status(200).json({status:200,data:data});
    } catch (err){
        return res.status(400).json({status:400, error:err.message});
    }

    
}

const waStatus = (code) => {
    switch (code) {
        case -1:
            return 'Error'

        case 0:
            return 'Sent'

        case 1:
            return 'Sent'

        case 2:
            return 'Delivered'

        case 3:
            return 'Read'

        default:
            return 'Invalid'
    }
}

module.exports = { createMessage,updateMsgStatus,sendInstanceMessage,sendWebhookMessage,instanceWiseMsgList,sendImage } 