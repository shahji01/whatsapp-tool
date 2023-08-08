import React, { useEffect, useState } from 'react'
import { BsMessenger,BsTrash } from "react-icons/bs";
import axios from 'axios';
import { baseUrl } from 'src/components/CommonComponent';
import Modal from "src/components/Modal";
import { 
    CCard,
    CCardHeader,
    CCardBody,
    CButton
   } from '@coreui/react'


const GroupList = () => {
  const [visible, setVisible] = useState(false);
  const [selectedGroupMsg, setSelectedGroupMsg] = useState(null);
  const [groupList,setGroupList] = useState([]);
  
  const getGroupList = async () => {
    const response = await axios.get(''+baseUrl+'/groups/group-list',{
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'authorization': `Bearer ${localStorage.getItem('instanceToken')}`
        },
      }).then(res => {
        if(res.data.status == 200){
          setGroupList(res.data.data);
        }
      })
  }
  useEffect(() => {
    getGroupList();
  },[]);

  const deleteGroup = async (name) => {
    const response = await axios.patch(''+baseUrl+'/groups/remove-group',{groupName:name},{
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'authorization': `Bearer ${localStorage.getItem('instanceToken')}`
      },
    }).then(res => {
      alert(res);
    });
    console.log(response);
  }
  
  return (
    <>
        <CCard className="mb-4">
            <CCardHeader>
                Group List
            </CCardHeader>
            <CCardBody>
            <div class="table-responsive text-nowrap">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th class="text-center">S.No</th>
                      <th class="text-center">Group Name</th>
                      <th class="text-center">UnRead Msg</th>
                      <th class="text-center">Total Participant</th>
                      {/* <th class="text-center">Participant No</th> */}
                      <th class="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                      groupList?.map((value, key) => {
                        let participantContact = '';
                        const paramDetail = {
                          'id':value.name,
                          'pageName':'sendMsgInGroup',
                          'title':'Send Msg In Group',
                          'size':'xl'
                        };
                      return (
                          
                          <tr key={key}>
                              <td class="text-center">{key+1}</td>
                              <td>{value.name}</td>
                              <td class="text-center">{value.unreadCount}</td>
                              <td class="text-center">{value.participants.length}</td>
                              {/* <td>{value.participants?.map((valueTwo,keyTwo) => {
                                participantContact += valueTwo.id.user+',';
                              })}{participantContact}</td> */}
                              <td class="text-center">
                                <CButton color="primary" size='sm' onClick={() => {setSelectedGroupMsg(paramDetail); setVisible(true);}}>
                                  <BsMessenger />
                                </CButton>
                                &nbsp;
                                {/* <CButton color="danger" size='sm' onClick={() => deleteGroup(value.name)}>
                                  <BsTrash />
                                </CButton> */}
                              </td>
                          </tr>
                      )
                      })
                  }
                  </tbody>
                </table>
              </div>
            </CCardBody>
        </CCard>
        <Modal
          visible={visible}
          details={selectedGroupMsg}
          onClose={() => setVisible(false)}
        />
    </>
  )
}

export default GroupList
