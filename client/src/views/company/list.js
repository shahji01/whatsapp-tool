import React, { useEffect, useState } from 'react'
import { FaEye } from "react-icons/fa";
import {getListData,displayButtonAddAndList, baseUrl} from 'src/components/CommonComponent'
import Modal from "src/components/Modal";
import { 
    CCard,
    CCardHeader,
    CCardBody,
    CRow,
    CCol,
    CButton
   } from '@coreui/react'
    


const CompanyList = () => {
  const [visible, setVisible] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyList,setCompanyList] = useState([]);

  const getCompanyList = async () => {
    const response = await getListData(''+baseUrl+'/companies');
    const data = await response.data.data;
    setCompanyList(data)
  }
  useEffect(() => {
    getCompanyList();
  },[]);
  return (
    <>
        <CRow>
          <CCol className="text-right">
            {displayButtonAddAndList('/company/add','Add Company','md','primary')}
          </CCol>
        </CRow>
        <br />
        <CCard className="mb-4">
            <CCardHeader>
                Company List
            </CCardHeader>
            <CCardBody>
              <div class="table-responsive text-nowrap">
                <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th class="text-center">S.No</th>
                        <th class="text-center">Name</th>
                        <th class="text-center">Package Name</th>
                        <th class="text-center">Allowed Url</th>
                        <th class="text-center">Webhook Url</th>
                        <th class="text-center">No of Instances Allowed</th>
                        <th class="text-center">Action</th>
                      </tr>
                    </thead>
                    
                    <tbody>
                    {
                        companyList?.map((value, key) => {
                          const paramDetail = {
                            'id':value._id,
                            'pageName':'companyDetail',
                            'title':'View Company Detail',
                            'size':'xl'
                          };
                        return (
                            
                            <tr key={key}>
                                <td class="text-center">{key+1}</td>
                                <td>{value.name}</td>
                                <td>{value.packageDetail[0].name}</td>
                                <td>{value.allowedUrl}</td>
                                <td>{value.webhook}</td>
                                <td class="text-center">{value.instanceAllowed}</td>
                                <td class="text-center">
                                  <CButton color="primary" size='sm' onClick={() => {setSelectedCompany(paramDetail); setVisible(true);}}>
                                    <FaEye />
                                  </CButton>
                                </td>
                            </tr>
                        )
                        })
                    } 
                    </tbody>
                  </table>
                </div>
                <Modal
                  visible={visible}
                  details={selectedCompany}
                  onClose={() => setVisible(false)}
                />
            </CCardBody>
        </CCard>
    </>
    
  )
}

export default CompanyList
