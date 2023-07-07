import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { baseUrl } from 'src/components/CommonComponent';
import { 
    CForm,
    CCol,
    CButton,
    CFormTextarea
    } from '@coreui/react'

const sendMsgInGroup = (props) => {
    const { id } = props
    const [errorMessage, setErrorMessage] = useState('');
    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            const { message } = event.target;
            const postData = JSON.stringify({ groupName: id,
                instanceId: localStorage.getItem('instanceToken'),
                message: message.value
              });
              const response = await axios.post(''+baseUrl+'/groups/send-msg-group', postData,{
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
        } catch (err){
            setErrorMessage(<div class="alert alert-danger show">{err.response.data.error}</div>)
        }
    }
    return (
        <>
            {errorMessage}
            <CForm
                className="row g-3 needs-validation"
                onSubmit={handleSubmit}
                validated={true}
              >
                <CCol md={12}>
                  <CFormTextarea
                    id="message"
                    name="message"
                    label="Message"
                    rows={10}
                    required
                  ></CFormTextarea>
                </CCol>
                <CCol xs={12}>
                  <CButton color="primary" type="submit">
                    Send
                  </CButton>
                </CCol>
            </CForm>
        </>
    )
}

export default sendMsgInGroup