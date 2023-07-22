
const findGroupByName = async function(id,name) {
    const client = await global.session.find(sess => sess.id == id)?.client
    const group = await client.getChats().then(chats => {
      return chats.find(chat => 
        chat.isGroup && chat.name.toLowerCase() == name.toLowerCase()
      );
    });
    return group;
  }

const createGroup = async (req, res) => {4
    try{
        const {groupName, contactName} = req.body
        const client = await global.session.find(sess => sess.id == req.instance._id)?.client
        const group = await findGroupByName(req.instance._id,groupName);
        if(group){
            res.send({'status':400,error:'Something went wrong! Group is already exits...'})
        }else{
            client.getContacts().then((contacts) => {
                const contactToAdd = contacts.find(
                // Finding the contact Id using the contact's name
                (contact) => contact.name === contactName
                );
                if (contactToAdd) {
                    client.createGroup(groupName,[contactToAdd.id._serialized]) // Pass an array of contact IDs [id1, id2, id3 .....]
                    .then(() =>
                        res.send({status:200,data:`Successfully Create Group and added ${contactName} to the group ${groupName}`})
                    );
                } else {
                    res.send({status:400, error:'Something went wrong! Contact not found...'})
                }
            });
        }
    } catch (err){
        return res.status(400).json({status:400, error:err.message});
    }
}

const contactList = async (req, res) => {
    try{
        const client = await global.session.find(sess => sess.id == req.instance._id)?.client
        let contactData = [];
        const data = await client.getContacts().then((contacts) => {
            contacts.forEach(contact => {
                if(contact.id.server === "c.us"){
                    if(contact.name != undefined){
                        contactData.push(contact.name);
                    }
                }
            });
        });
        return res.status(200).json({status:200,data:contactData});
    } catch (err){
        return res.status(400).json({status:400, error:err.message});
    }
}

const groupList = async (req, res) => {
    try{
        let groupList = []
        const client = await global.session.find(sess => sess.id == req.instance._id)?.client
        const data = await client.getChats().then((data) => {
            data.forEach(chat => {
                if(chat.id.server === "g.us"){
                    groupDetail = {
                        "name": chat.name,
                        "isGroup": chat.isGroup,
                        "isReadOnly": chat.isReadOnly,
                        "unreadCount": chat.unreadCount,
                        "timestamp": chat.timestamp,
                        "pinned": chat.pinned,
                        "isMuted": chat.isMuted,
                        "muteExpiration": chat.muteExpiration,
                        "participants":chat.participants,
                        "lastMessage":chat.lastMessage,
                    }
                    groupList.push(groupDetail)
                }
            })
        })
        return res.status(200).json({status:200,data:groupList});
    } catch (err){
        return res.status(400).json({status:400, error:err.message});
    }
}

const sendMsgGroup = async (req, res) => {
    try{
        let groupName = req.body.groupName;
        let message = req.body.message;

        if (groupName == undefined || message == undefined) {
            return res.send({ status: "error", message: "please enter valid groupName and message" })
        } else {
            const group = await findGroupByName(req.instance._id,groupName);
            if(group){
                const client = await global.session.find(sess => sess.id == req.instance._id)?.client
                const data = await client.getChats().then((data) => {
                    data.forEach(chat => {
                        if (chat.id.server === "g.us" && chat.name === groupName) {
                            client.sendMessage(chat.id._serialized, message).then((response) => {
                                if (response.id.fromMe) {
                                    return res.status(200).json({status:200, message: `Message successfully send to ${groupName}` })
                                }
                            });
                        }
                    });     
                });
            }else{
                return res.status(400).json({status:400, error:'Something went wrong! Group is not exits plz create group...'});
            }
        }
    } catch (err){
        return res.status(400).json({status:400, error:err.message});
    }
}

const removeParticipantInGroup = async (req, res) => {
    const {groupName, contactName} = req.body
    if (groupName == '' || contactName == '') {
        return res.send({ status: "error", message: "please enter valid groupName and contactName" })
    } else {
        const group = await findGroupByName(req.instance._id,groupName);
        if(group){
            const client = await global.session.find(sess => sess.id == req.instance._id)?.client
            client.getChats().then((chats) => {
                const myGroup = chats.find((chat) => chat.name === groupName);
                client.getContacts().then((contacts) => {
                const contactToAdd = contacts.find(
                    // Finding the contact Id using the contact's name
                    (contact) => contact.name === contactName
                );
                if (contactToAdd) {
                    myGroup
                    .removeParticipants([contactToAdd.id._serialized]) // Pass an array of contact IDs [id1, id2, id3 .....]
                    .then(() =>
                        res.send({'status':'Success','message':`Successfully removed ${contactName} to the group ${groupName}`})
                    );
                } else {
                    res.send({'status':'failed','message':'Something went wrong! Participant not found...'})
                }
                });
            })
        }else{
            res.send({'status':'failed','message':'Something went wrong! Group is not exits plz create group...'})
        }
    }
}

const addParticipantInGroup = async (req, res) => {
    const {groupName, contactName} = req.body
    if (groupName == '' || contactName == '') {
        return res.send({ status: "error", message: "please enter valid groupName and contactName" })
    } else {
        const group = await findGroupByName(req.instance._id,groupName);
        if(group){
            const client = await global.session.find(sess => sess.id == req.instance._id)?.client
            client.getChats().then((chats) => {
                const myGroup = chats.find((chat) => chat.name === groupName);
                client.getContacts().then((contacts) => {
                const contactToAdd = contacts.find(
                    // Finding the contact Id using the contact's name
                    (contact) => contact.name === contactName
                );
                if (contactToAdd) {
                    myGroup
                    .addParticipants([contactToAdd.id._serialized]) // Pass an array of contact IDs [id1, id2, id3 .....]
                    .then(() =>
                        res.send({'status':'Success','message':`Successfully added ${contactName} to the group ${groupName}`})
                    );
                } else {
                    res.send({'status':'failed','message':'Something went wrong! Contact not found...'})
                }
                });
            })
        }else{
            res.send({'status':'failed','message':'Something went wrong! Group is not exits plz create group...'})
        }
    }
}

const removeGroup = async (req, res) => {
    try{
        const {groupName} = req.body
        if(groupName == ''){
            return res.send({ status: 400, error: "please enter valid groupName" })
        }else{
            const client = await global.session.find(sess => sess.id == req.instance._id)?.client
            console.log(client);
            // const data = await client.(groupName);
            // console.log(data);
        }


        return res.status(200).json({status:200,data:'Successfully Remove Group'});
    } catch (err){
        return res.status(400).json({status:400, error:err.message});
    }
    
}



module.exports = {
    createGroup,
    groupList,
    sendMsgGroup,
    addParticipantInGroup,
    removeParticipantInGroup,
    removeGroup,
    contactList
}