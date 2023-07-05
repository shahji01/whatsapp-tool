import React,{useState, useEffect} from 'react'
import { BsMessenger,BsToggleOff,BsToggleOn,BsFillPencilFill } from "react-icons/bs";
import { Link, useNavigate } from 'react-router-dom'
import {baseUrl, getListData, baseUrlTwo} from 'src/components/CommonComponent';
import Modal from "src/components/Modal";

import { 
    CCard,
    CCardHeader,
    CCardBody,
    CRow,
    CCol,
    CButton
   } from '@coreui/react'


const InstantList = () => {
  const navigate = useNavigate();
  const [visibleTwo, setVisibleTwo] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [visible, setVisible] = useState(false);
  const [selectedConnectInstance, setSelectedConnectInstance] = useState(null);
  const [companyInstanceList,setCompanyInstanceList] = useState([]);

  const paramDetail = {
    'companyId':localStorage.getItem('companyId'),
    'pageName':'addInstance',
    'title':'Add Instance',
    'size':'md'
  };

  

  

  const getInstanceList = async () => {
    const companyId = localStorage.getItem('companyId');
    const response = await getListData(''+baseUrl+'/companies/companyInstance/'+companyId+'');
    const data = await response.data.data;
    setCompanyInstanceList(data);
  }
  useEffect(() => {
    getInstanceList();
  },[]);

  const disconectInstance = (token) => {
    alert(token)
    // var socket = io.connect( baseUrlTwo ,{query:'token='+token});
  }

  const openInnerPagesInstance = (name,phoneNo,token) => {
    localStorage.setItem('instanceToken',token);
    navigate("/instance/index",{state:{name:name,phoneNo:phoneNo}});
  }
  return (
    <>
        <CRow>
          <CCol className="text-right">
            <CButton color="primary" size="md" onClick={() => {setVisibleTwo(true);setSelectedInstance(paramDetail);}}><BsFillPencilFill/> Add Instance</CButton>
          </CCol>
        </CRow>
        <br />
        <CCard className="mb-4">
            <CCardHeader>
                Instances List
            </CCardHeader>
            <CCardBody>
              <div class="table-responsive text-nowrap">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th class="text-center">S.No</th>
                      <th class="text-center">Id</th>
                      <th class="text-center">Name</th>
                      <th class="text-center">Phone</th>
                      <th class="text-center">Token</th>
                      <th class="text-center">Status</th>
                      <th class="text-center">Action</th>
                    </tr>
                  </thead>
                  
                  <tbody>
                    
                  {
                      
                      companyInstanceList[0]?.instances?.map((value, key) => {
                        const paramDetailTwo = {
                          'id':value.token,
                          'pageName':'connectInstance',
                          'title':'Connect Instance',
                          'size':'md'
                        };
                        
                        return (
                              
                              <tr key={key}>
                                  <td class="text-center">{key+1}</td>
                                  <td>{value._id}</td>
                                  <td>{value.name}</td>
                                  <td class="text-center">{value.phone ? (value.phone) : ('-')}</td>
                                  <td>{value.token}</td>
                                  <td class="text-center">{value.status ? ('Connected') : ('Disconnected')}</td>
                                  <td class="text-center">
                                    {
                                      value.status ? [(<CButton onClick={() => openInnerPagesInstance(value.name,value.phone,value.token)}><BsMessenger/></CButton>),(' '),(<CButton color='danger' onClick={() => disconectInstance(value.token)}><BsToggleOn/></CButton>)] : (<CButton color="primary" size="sm" onClick={() => {setVisible(true);setSelectedConnectInstance(paramDetailTwo);}}><BsToggleOff /></CButton>)
                                      // value.status ? [(<Link to = {{pathname:`/message/add/`+value.token}}><CButton>Messaage</CButton></Link>),(' '),(<CButton>Disconnect</CButton>)] : (<CButton>Connected</CButton>)
                                    }
                                  </td>
                              </tr>
                          )
                      })
                  } 
                  </tbody>
                </table>
              </div>
              <Modal
                visible={visibleTwo}
                details={selectedInstance}
                onClose={() => setVisibleTwo(false)}
              />
              <Modal
                visible={visible}
                details={selectedConnectInstance}
                onClose={() => setVisible(false)}
              />
            </CCardBody>
        </CCard>
    </>
  )
}

export default InstantList
