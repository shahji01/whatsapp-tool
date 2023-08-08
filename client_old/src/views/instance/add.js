import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios';
import {baseUrl, inserData} from 'src/components/CommonComponent'
import { 
    CRow,
    CCol,
    CButton,
    CForm
   } from '@coreui/react'   

const InstanceForm = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            const postData = JSON.stringify({ companyId:localStorage.getItem('companyId') });
            const response = await inserData(''+baseUrl+'/companies/addInstance',postData);
            
            if(response.data.status == 200){
                window.location.reload(false);
            }
        } catch(err){
            setErrorMessage(<div class="alert alert-danger show">{err.response.data.error}</div>)
        }
    };
  return (
    <>
        {errorMessage}
        <CForm
            className="row g-3 needs-validation"
            onSubmit={handleSubmit}
            validated={true}
        >
            <CRow>
                <CCol class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    are you sure!
                </CCol>
                <CCol class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-right">
                    <CButton type="submit">Confirm</CButton>
                </CCol>
            </CRow>
        </CForm>
    </>
  )
}

export default InstanceForm
