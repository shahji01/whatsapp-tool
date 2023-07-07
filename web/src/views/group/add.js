import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios';
import {baseUrl} from 'src/components/CommonComponent'
import { 
    CCard,
    CCardHeader,
    CCardBody,
    CForm,
    CCol,
    CFormLabel,
    CFormSelect,
    CFormInput,
    CButton
   } from '@coreui/react'

const GroupForm = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [contactList,setContactList] = useState([]);
  const contactData = async () => {
    axios
    .get(''+baseUrl+'/groups/contactList',{
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'authorization': `Bearer ${localStorage.getItem('instanceToken')}`
      },
    })
    .then((response) => {
      const { data } = response.data;
      if(response.status === 200){
        setContactList(data)
      }
    })
    .catch((error) => console.log(error));
  };

  useEffect(()=>{
    contactData();
  },[])
  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
      const { contactName, groupName } = event.target;
      const postData = JSON.stringify({
        contactName: contactName.value,
        groupName:groupName.value
      });
      const response = await axios.post(''+baseUrl+'/groups/create-group', postData,{
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'authorization': `Bearer ${localStorage.getItem('instanceToken')}`
        },
      }).then(res => {
        if(res.data.status == 200){
          window.location.reload(false);
        }
      })
    }catch (err){

    }
  }
  return (
    <>
        <CCard className="mb-4">
            <CCardHeader>
                Make New Group
            </CCardHeader>
            <CCardBody>
            <CForm
              className="row g-3 needs-validation"
              onSubmit={handleSubmit}
              validated={true}
            >
              <CCol md={6}>
                <CFormLabel htmlFor="packageId">Contact Name</CFormLabel>
                <CFormSelect aria-label="Default select example" required invalid name="contactName" id="contactName">
                    <option value="">Select One</option>
                    {contactList.map((item) => (
                    <option key={item} value={item}>
                          {item}
                      </option>
                    ))}
                  </CFormSelect>
              </CCol>
              <CCol md={4}>
                <CFormInput
                  type="text"
                  defaultValue=""
                  id="groupName"
                  name="groupName"
                  label="Group Name"
                  required
                />
              </CCol>
              <CCol xs={12}>
                <CButton color="primary" type="submit">
                  Submit form
                </CButton>
              </CCol>
            </CForm>
            </CCardBody>
        </CCard>
    </>
  )
}

export default GroupForm
