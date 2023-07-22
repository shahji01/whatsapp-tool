import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import {inserData, displayButtonAddAndList, baseUrl} from 'src/components/CommonComponent'
import { 
    CCard,
    CCardHeader,
    CCardBody,
    CForm,
    CCol,
    CFormInput,
    CButton,
    CRow,
   } from '@coreui/react'   
    

const PackageForm = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
      const { name, messagesAllowed, priceDetail, discountDetail } = event.target;

      const postData = JSON.stringify({ 
        name: name.value,
        messagesAllowed: messagesAllowed.value,
        price: {
          monthly: priceDetail[0].value,
          quaterly: priceDetail[1].value, 
          halfyearly: priceDetail[2].value, 
          yearly: priceDetail[3].value
        },
        discount: {
          monthly: discountDetail[0].value,
          quaterly: discountDetail[1].value, 
          halfyearly: discountDetail[2].value, 
          yearly: discountDetail[3].value
        }
      });
      const response = await inserData(''+baseUrl+'/packages/',postData);
      if(response.data.status == 200){
        navigate("/packages/list");
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
            {displayButtonAddAndList('/packages/list','Package List','sm','primary')}
          </CCol>
        </CRow>
        <br />
        <CCard className="mb-4">
            <CCardHeader>
                Add Package
            </CCardHeader>
            <CCardBody>
              <CForm
                className="row g-3 needs-validation"
                onSubmit={handleSubmit}
                validated={true}
              >
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    defaultValue=""
                    id="name"
                    name="name"
                    label="Package Name"
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="number"
                    defaultValue=""
                    id="messagesAllowed"
                    name="messagesAllowed"
                    label="How many Message Allowed"
                    required
                  />
                </CCol>
                <CCol md={12}>
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th colSpan={4}>Price Detail</th>
                      </tr>
                      <tr>
                        <th class="text-center">Monthly</th>
                        <th class="text-center">Quaterly</th>
                        <th class="text-center">Half Yearly</th>
                        <th class="text-center">Yearly</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <CFormInput
                            type="number"
                            defaultValue=""
                            id="priceDetail"
                            name="priceDetail[]"
                            required
                          />
                        </td>
                        <td>
                          <CFormInput
                            type="number"
                            defaultValue=""
                            id="priceDetail"
                            name="priceDetail[]"
                            required
                          />
                        </td>
                        <td>
                          <CFormInput
                            type="number"
                            defaultValue=""
                            id="priceDetail"
                            name="priceDetail[]"
                            required
                          />
                        </td>
                        <td>
                          <CFormInput
                            type="number"
                            defaultValue=""
                            id="priceDetail"
                            name="priceDetail[]"
                            required
                          />
                        </td>
                      </tr>
                    </tbody>
                    <thead>
                      <tr>
                        <th colSpan={4}>Discount Detail</th>
                      </tr>
                      <tr>
                        <th class="text-center">Monthly</th>
                        <th class="text-center">Quaterly</th>
                        <th class="text-center">Half Yearly</th>
                        <th class="text-center">Yearly</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <CFormInput
                            type="number"
                            defaultValue=""
                            id="discountDetail"
                            name="discountDetail[]"
                            required
                          />
                        </td>
                        <td>
                          <CFormInput
                            type="number"
                            defaultValue=""
                            id="discountDetail"
                            name="discountDetail[]"
                            required
                          />
                        </td>
                        <td>
                          <CFormInput
                            type="number"
                            defaultValue=""
                            id="discountDetail"
                            name="discountDetail[]"
                            required
                          />
                        </td>
                        <td>
                          <CFormInput
                            type="number"
                            defaultValue=""
                            id="discountDetail"
                            name="discountDetail[]"
                            required
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
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

export default PackageForm
