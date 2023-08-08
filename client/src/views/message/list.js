import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { MDBDataTable, MDBCard, MDBCardBody } from 'mdbreact';
import { 
    CCard,
    CCardHeader,
    CCardBody,
   } from '@coreui/react'
import { baseUrl } from 'src/components/CommonComponent';


const MessageList = () => {
  const [messageList,setMessageList] = useState([]);
  
  const getMessageList = async () => {
    const response = await axios.get(''+baseUrl+'/message/instanceWiseMsgList',{
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'authorization': `Bearer ${localStorage.getItem('instanceToken')}`
        },
      }).then(res => {
        if(res.data.status == 200){
          setMessageList(res.data.data);
        }
      })
  }
  
  useEffect(() => {
    getMessageList();
  },[]);
  const detail = [];
  messageList?.map((value, key) => {
    detail.push({
      sender:value.sender,
      recipient:value.recipient,
      messageTwo:value.message,
      statusTwo:value.status,
    })
  });

  const data = {
    columns: [
      {
        label: "Sender",
        field: "sender",
        sort: "asc"
      },
      {
        label: "Receiver",
        field: "recipient",
        sort: "asc"
      },
      {
        label: "Message",
        field: "messageTwo",
        sort: "asc"
      },
      {
        label: "Status",
        field: "statusTwo",
        sort: "asc"
      }
    ],
    rows: detail
  };
  return (
    <>
        <MDBCard className="mb-4">
            <CCardHeader>
                Messaage List Instance Wise
            </CCardHeader>
            <MDBCardBody>
              <MDBDataTable
                striped
                bordered
                data={data}
              />
            </MDBCardBody>
        </MDBCard>
    </>
  )
}

export default MessageList
