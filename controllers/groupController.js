
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
    const {groupName, contactName} = req.body
    const client = await global.session.find(sess => sess.id == req.user._id)?.client
    const group = await findGroupByName(req.user._id,groupName);
    if(group){
        res.send({'status':'failed','message':'Something went wrong! Group is already exits...'})
    }else{
        client.getContacts().then((contacts) => {
            const contactToAdd = contacts.find(
              // Finding the contact Id using the contact's name
              (contact) => contact.name === contactName
            );
            if (contactToAdd) {
                client.createGroup(groupName,[contactToAdd.id._serialized]) // Pass an array of contact IDs [id1, id2, id3 .....]
                .then(() =>
                  res.send({'status':'Success','message':`Successfully Create Group and added ${contactName} to the group ${groupName}`})
                );
            } else {
              res.send({'status':'failed','message':'Something went wrong! Contact not found...'})
            }
        });
    }
}

const groupList = async (req, res) => {
    let groupList = []
    const client = await global.session.find(sess => sess.id == req.user._id)?.client
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
                }
                groupList.push(groupDetail)
            }
        })
    })
    return res.status(201).json(groupList)
}

const sendMsgGroup = async (req, res) => {
    let groupName = req.params.groupName;
    let message = req.body.message;

    if (groupName == undefined || message == undefined) {
        return res.send({ status: "error", message: "please enter valid groupName and message" })
    } else {
        const group = await findGroupByName(req.user._id,groupName);
        if(group){
            const client = await global.session.find(sess => sess.id == req.user._id)?.client
            client.getChats().then((data) => {
                data.forEach(chat => {
                    if (chat.id.server === "g.us" && chat.name === groupName) {
                        client.sendMessage(chat.id._serialized, message).then((response) => {
                            if (response.id.fromMe) {
                                return res.send({ status: 'success', message: `Message successfully send to ${groupName}` })
                            }
                        });
                    }
                });     
            });
        }else{
            res.send({'status':'failed','message':'Something went wrong! Group is not exits plz create group...'})
        }
    }
}

const removeParticipantInGroup = async (req, res) => {
    const {groupName, contactName} = req.body
    if (groupName == '' || contactName == '') {
        return res.send({ status: "error", message: "please enter valid groupName and contactName" })
    } else {
        const group = await findGroupByName(req.user._id,groupName);
        if(group){
            const client = await global.session.find(sess => sess.id == req.user._id)?.client
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
        const group = await findGroupByName(req.user._id,groupName);
        if(group){
            const client = await global.session.find(sess => sess.id == req.user._id)?.client
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
    const {groupName} = req.body
    if(groupName == ''){
        return res.send({ status: "error", message: "please enter valid groupName" })
    }else{
        console.log(groupName);
    }
}



module.exports = {
    createGroup,
    groupList,
    sendMsgGroup,
    addParticipantInGroup,
    removeParticipantInGroup,
    removeGroup
}