import React, { useEffect, useState } from 'react'
import axios from 'axios';
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
  return (
    <>
        <CCard className="mb-4">
            <CCardHeader>
                Messaage List Instance Wise
            </CCardHeader>
            <CCardBody>
              <div class="table-responsive text-nowrap">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th class="text-center">S.No</th>
                      <th class="text-center">Sender</th>
                      <th class="text-center">Receiver</th>
                      <th class="text-center">Message</th>
                      <th class="text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                      messageList?.map((value, key) => {
                      return (
                          
                          <tr key={key}>
                              <td class="text-center">{key+1}</td>
                              <td class="text-center">{value.sender}</td>
                              <td class="text-center">{value.recipient}</td>
                              <td>{value.message}</td>
                              <td class="text-center">{value.status}</td>
                          </tr>
                      )
                      })
                  }
                  </tbody>
                </table>
              </div>
            </CCardBody>
        </CCard>
    </>
  )
}

export default MessageList
