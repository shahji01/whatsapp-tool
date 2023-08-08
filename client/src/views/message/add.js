import React, {useState,useEffect} from 'react'
import { read, utils, writeFile } from 'xlsx';
import axios from 'axios';
import { baseUrl } from 'src/components/CommonComponent';
import { 
    CCard,
    CCardHeader,
    CCardBody,
    CForm,
    CCol,
    CFormInput,
    CButton,
    CFormTextarea,
    CRow
   } from '@coreui/react'



const MessageForm = () => {
  
  const [errorMessage, setErrorMessage] = useState('');
  const [receipientNo, setReceiptNo] = useState('');

    const handleImport = ($event) => {
      const files = $event.target.files;
      if (files.length) {
          const file = files[0];
          const reader = new FileReader();
          reader.onload = (event) => {
              const wb = read(event.target.result);
              const sheets = wb.SheetNames;

              if (sheets.length) {
                  const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                  let contactList = '';
                  if(receipientNo){
                    contactList = receipientNo+',';
                  }
                  
                  for (var i=0; i < rows.length; i++) {
                    contactList += rows[i]['Contact-No']+',';
                  }
                  let lastComaRemoveCL = contactList.slice(0, -1)
                  setReceiptNo(lastComaRemoveCL);
              }
          }
          reader.readAsArrayBuffer(file);
      }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
      const { recipient, message } = event.target;
      const postData = JSON.stringify({ recipientTwo: recipient.value,
        instanceId: localStorage.getItem('instanceToken'),
        message: message.value,
        referenceNumber:155,
        type:1
      });
      const response = await axios.post(''+baseUrl+'/message/', postData,{
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'authorization': `Bearer ${localStorage.getItem('instanceToken')}`
        },
      }).then(res => {
        if(res.data.status == 200){
          var numberError = [];
          {res.data.data.map((detail) => {
            if(detail.status == 'False'){
              numberError.push(detail.recipient);
            }
          })}
          console.log(numberError);
          if(numberError.length > 0){
            setErrorMessage(<div class="alert alert-danger show">
              {'These number is not registered...  '}
              {numberError.map((number) => {
                return number+' , ';
              })}
            </div>)
          }else{
            window.location.reload(false);
          }
        }
      })
    } catch(err){
      //setErrorMessage(<div class="alert alert-danger show">{err}</div>)
      // setErrorMessage(<div class="alert alert-danger show">
      //     {err.response.data.error+'  '}
      //     {err.response.data.numberError.map((number) => {
      //       return number+'   ';
      //     })}
      //   </div>)
    }
  };

  const updateReceiptNo = (event) => {
    let receiptNoComaSeperated = event.target.value.split(" ").join(',');
    setReceiptNo(receiptNoComaSeperated);
    
  }

  return (
    <>
        {errorMessage}
        <CCard className="mb-4">
            <CCardHeader>
                Add Message
            </CCardHeader>
            <CCardBody>
              <CForm
                className="row g-3 needs-validation"
                onSubmit={handleSubmit}
                validated={true}
              >
                <CCol md={6}>
                  <CRow>
                    <CCol md={12}>
                      <CFormTextarea
                        id="recipient"
                        name="recipient[]"
                        label="Receipient No's"
                        value={receipientNo}
                        onChange={updateReceiptNo}
                        rows={5}
                        required
                      ></CFormTextarea>
                    </CCol>
                    <CCol md={12}>&nbsp;</CCol>
                    <CCol md={12}>
                      <input type="file" accept=".xls, .xlsx" onChange={handleImport} />
                    </CCol>
                  </CRow>
                </CCol>
                <CCol md={6}>
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
            </CCardBody>
        </CCard>
    </>
  )
}

export default MessageForm
