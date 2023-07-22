import React,{useState,useEffect} from 'react'
import { FaEye } from "react-icons/fa";

import {getListData,displayButtonAddAndList, baseUrl, numberFormat} from 'src/components/CommonComponent'
import Modal from "src/components/Modal";
import { 
    CCard,
    CCardHeader,
    CCardBody,
    CRow,
    CCol,
    CButton} from '@coreui/react'

    

const PackageList = () => {
    const [visible, setVisible] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [packageList,setPackageList] = useState([]);

    const getPackageList = async () => {
        const response = await getListData(''+baseUrl+'/packages');
        const data = await response.data.data;
        setPackageList(data)
      }
      useEffect(() => {
        getPackageList();
      },[]);
  
  return (
    <>
        <CRow>
          <CCol className="text-right">
            {displayButtonAddAndList('/packages/add','Add Package','md','primary')}
          </CCol>
        </CRow>
        <br />
        <CCard className="mb-4">
            <CCardHeader>
                Package List
            </CCardHeader>
            <CCardBody>
            <div class="table-responsive text-nowrap">
            <table class="table table-bordered">
                <thead>
                  <tr>
                    <th class="text-center">S.No</th>
                    <th class="text-center">Package Name</th>
                    <th class="text-center">Message Allowed</th>
                    <th class="text-center">Price Detail</th>
                    <th class="text-center">Discount Detail</th>
                    <th class="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                {
                    packageList?.map((value, key) => {
                        const paramDetail = {
                            'id':value._id,
                            'pageName':'packageDetail',
                            'title':'View Package Detail',
                            'size':'xl'
                          };
                    return (
                        <tr key={key}>
                            <td class="text-center">{key+1}</td>
                            <td>{value.name}</td>
                            <td class="text-center">{value.messagesAllowed}</td>
                            <td>
                                <table class="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th class="text-center">Monthly</th>
                                            <th class="text-center">Quaterly</th>
                                            <th class="text-center">Half Yearly</th>
                                            <th class="text-center">Yearly</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="text-right">{numberFormat(value.price.monthly)}</td>
                                            <td class="text-right">{numberFormat(value.price.quaterly)}</td>
                                            <td class="text-right">{numberFormat(value.price.halfyearly)}</td>
                                            <td class="text-right">{numberFormat(value.price.yearly)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td>
                                <table class="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th class="text-center">Monthly</th>
                                            <th class="text-center">Quaterly</th>
                                            <th class="text-center">Half Yearly</th>
                                            <th class="text-center">Yearly</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="text-right">{numberFormat(value.discount.monthly)}</td>
                                            <td class="text-right">{numberFormat(value.discount.quaterly)}</td>
                                            <td class="text-right">{numberFormat(value.discount.halfyearly)}</td>
                                            <td class="text-right">{numberFormat(value.discount.yearly)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td class="text-center">
                              <CButton color="primary" size='sm' onClick={() => {setSelectedPackage(paramDetail); setVisible(true);}}>
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
                details={selectedPackage}
                onClose={() => setVisible(false)}
              />
            </CCardBody>
        </CCard>
    </>
  )
}

export default PackageList
