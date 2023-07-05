import React from 'react';
const CompanyDetail = React.lazy(() => import('../views/company/viewCompanyDetail'))
const PackageDetail = React.lazy(() => import('../views/packages/viewPackageDetail'))
const AddInstance = React.lazy(() => import('../views/instance/add'))
const ConnectInstance = React.lazy(() => import('../views/instance/connectInstance'))

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
  
  if(details != undefined){
    title = details.title;
    id = details.id;
    size = details.size;
    pageName = details.pageName;
    if(pageName == 'companyDetail'){
      dynemicData = <CompanyDetail id={id} />;
    }else if(pageName == 'packageDetail'){
      dynemicData = <PackageDetail id={id} />;
    }else if(pageName == 'addInstance'){
      dynemicData = <AddInstance id={id} />
    }else if(pageName == 'connectInstance'){
      dynemicData = <ConnectInstance id={id} />
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
        {/* <CModalFooter>
          <CButton color="secondary" onClick={onClose}>
            Close
          </CButton>
        </CModalFooter> */}
      </CModal>
    </>
  );
};

export default Modal;
