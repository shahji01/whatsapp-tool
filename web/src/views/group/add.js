import React from 'react'
import CommonComponent, { baseUrl } from 'src/components/CommonComponent';
import { 
    CCard,
    CCardHeader,
    CCardBody,
   } from '@coreui/react'

    const response = await fetch(
      ``+baseUrl+`/companies`,
      {
        method: "GET",
      },
    );
     const data = await response.json();

const GroupForm = () => {
  
  return (
    <>
        <CCard className="mb-4">
            <CCardHeader>
                Add Group
            </CCardHeader>
            <CCardBody>
            
            </CCardBody>
        </CCard>
    </>
  )
}

export default GroupForm
