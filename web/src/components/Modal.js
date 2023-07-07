import React,{lazy, Suspense} from 'react';
const CompanyDetail = lazy(() => import('../views/company/viewCompanyDetail'))
const PackageDetail = lazy(() => import('../views/packages/viewPackageDetail'))
const AddInstance = lazy(() => import('../views/instance/add'))
const ConnectInstance = lazy(() => import('../views/instance/connectInstance'))
const SendMsgInGroup = lazy(() => import('../views/group/sendMsgInGroup'))
import Loader from './Loader';
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";

const Modal = ({ visible, onClose, details }) => {
  
  let title = '';
  let id = '';
  let pageName = '';
  let dynemicData = '';
  let size = '';

  if(details != null){
    title = details.title;
    id = details.id;
    size = details.size;
    pageName = details.pageName;
    if(pageName == 'companyDetail'){
      dynemicData = <Suspense fallback={Loader}><CompanyDetail id={id} /></Suspense>
    }else if(pageName == 'packageDetail'){
      dynemicData = <Suspense fallback={Loader}><PackageDetail id={id} /></Suspense>
    }else if(pageName == 'addInstance'){
      dynemicData = <Suspense fallback={Loader}><AddInstance id={id} /></Suspense>
    }else if(pageName == 'connectInstance'){
      dynemicData = <Suspense fallback={Loader}><ConnectInstance id={id} /></Suspense>
    }else if(pageName == 'sendMsgInGroup'){
      dynemicData = <Suspense fallback={Loader}><SendMsgInGroup id={id} /></Suspense>
    }
  }
  return (
    <>
      <CModal size={size} visible={visible} onClose={onClose}>
        <CModalHeader onClose={onClose}>
          <CModalTitle>{title}</CModalTitle>
        </CModalHeader>
        <CModalBody id="modalDynemicData">
          {dynemicData}
        </CModalBody>
      </CModal>
    </>
  );
};

export default Modal;
