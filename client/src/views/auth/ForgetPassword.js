import {React, useEffect, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { baseUrl } from 'src/components/CommonComponent';

const ForgetPassword = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [authenticated, setauthenticated] = useState(localStorage.getItem(localStorage.getItem("authenticated")|| false));
  useEffect(() => {
    const auth = localStorage.getItem('token');
    if(auth){
      navigate("/dashboard");
    }
  },[])
  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
      const { email } = event.target;
      const postData = JSON.stringify({
        email: email.value,
      });

      const response = await axios.patch(''+baseUrl+'/user/forgetPassword', postData,{
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).then(res => {
        if(res.data.status == 200){
          navigate("/CPWithOtp");
        }
      });
    } catch(err){
      setErrorMessage(<div class="alert alert-danger show">{err.response.data.error}</div>)
    }
    
  };
  return (
    <div className="bg-light min-vh-100 flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            
              <CCard className="p-4" style={{ margin: '10%' }}>
                <CCardBody>
                  {errorMessage}
                  <CForm onSubmit={handleSubmit} validated={true}>
                    <h3>Forget Password</h3>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="Email" required autoComplete="emaill" name="email" />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type="submit">
                          Submit
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <Link to="/">
                          <CButton color="link" className="px-0">
                            Login
                          </CButton>
                        </Link>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default ForgetPassword
