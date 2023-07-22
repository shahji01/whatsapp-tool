import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios';
import {inserData,displayButtonAddAndList,baseUrl} from 'src/components/CommonComponent'
import { 
    CCard,
    CCardHeader,
    CCardBody,
    CForm,
    CRow,
    CCol,
    CButton,
    CFormInput,
    CFormLabel,
    CFormSelect,
   } from '@coreui/react'
   
   
    


const CompanyForm = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [packageList,setPackageList] = useState([]);
  
  const packageData = async () => {
    axios
    .get(''+baseUrl+'/packages')
    .then((response) => {
      const { data } = response.data;
      if(response.status === 200){
        setPackageList(data)
      }
    })
    .catch((error) => console.log(error));
  };

  useEffect(()=>{
    packageData();
  },[])
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
      const { name, instanceAllowed, packageId, email, password, allowedUrl, webhook } = event.target;
      const postData = JSON.stringify({ name: name.value,
        instanceAllowed: instanceAllowed.value,
        packageId: packageId.value,
        allowedUrl: allowedUrl.value,
        webhook: webhook.value,
        email: email.value,
        password:password.value,
        type:'Company' });
      const response = await inserData(''+baseUrl+'/companies/',postData);
      
      if(response.data.status == 200){
        navigate("/company/list");
      }
    } catch(err){
      setErrorMessage(<div class="alert alert-danger show">{err.response.data.error}</div>)
    }
    
  };
  return (
    <>
        {errorMessage}
        <CRow>
          <CCol className="text-right">
            {displayButtonAddAndList('/company/list','Company List','sm','primary')}
          </CCol>
        </CRow>
        <br />
        <CCard className="mb-4">
            <CCardHeader>
                Add Company
            </CCardHeader>
            <CCardBody>
            <CForm
              className="row g-3 needs-validation"
              onSubmit={handleSubmit}
              validated={true}
            >
              <CCol md={4}>
                <CFormInput
                  type="text"
                  defaultValue=""
                  id="name"
                  name="name"
                  label="Company Name"
                  required
                />
              </CCol>
              <CCol md={4}>
                <CFormInput
                  type="number"
                  defaultValue=""
                  id="instanceAllowed"
                  name="instanceAllowed"
                  label="How many Instance Allowed"
                  invalid
                  required
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="packageId">Package Name</CFormLabel>
                <CFormSelect aria-label="Default select example" required invalid name="packageId" id="packageId">
                    <option value="">Select Package</option>
                    {packageList.map((item) => (
                    <option key={item._id} value={item._id}>
                          {item.name}
                      </option>
                    ))}
                  </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  id="email"
                  name="email"
                  label="Email"
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="password"
                  id="password"
                  name="password"
                  label="Password"
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  id="allowedUrl"
                  name="allowedUrl"
                  label="Allowed Url"
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  id="webhook"
                  name="webhook"
                  label="Webhook"
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

export default CompanyForm

