import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { 
    CCard,
    CCardHeader,
    CCardBody,
   } from '@coreui/react'
import { baseUrl } from 'src/components/CommonComponent';


const GroupList = () => {

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
                    </tr>
                  </thead>
                  <tbody>
                  {
                      groupList?.map((value, key) => {
                      return (
                          
                          <tr key={key}>
                              <td class="text-center">{key+1}</td>
                              <td>{value.name}</td>
                              <td class="text-center">{value.unreadCount}</td>
                              <td class="text-center">{value.participants.length}</td>

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

export default GroupList
