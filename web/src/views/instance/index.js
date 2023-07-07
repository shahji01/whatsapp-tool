import React,{useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom'
import MessageAdd from '../message/add'
import MessageList from '../message/list'

import GroupAdd from '../group/add'
import GroupList from '../group/list'


import { 
  CAlert,
  CCol,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTabPane
   } from '@coreui/react'
   const tabs = [
    { component: MessageAdd, name : 'Send New Message',active: 1 },
    { component: MessageList, name : 'Message List',active:2 },
    { component: GroupAdd, name : 'Make New Group',active: 3 },
    { component: GroupList, name : 'Group List',active:4 },
    // { component: Tab3, isDisabled: true },
    // { component: Tab4 },
  ];
const InstantSubOption = () => {
    const { state } = useLocation();
    const [currentTabIndex, setCurrentTabIndex] = useState(0);
    const renderTabPanel = () => {
      const TabPanel = tabs[currentTabIndex].component;
      return <TabPanel />;
    };
    

    const [activeKey, setActiveKey] = useState(1)
    return (
        <>
          <CRow>
            <CCol md={{ span: 6, offset: 3 }} className='text-center'>
              <h5>( Selected Instance => {state.name}  -  {state.phoneNo} )</h5>
            </CCol>
          </CRow>
          <CNav variant="tabs" role="tablist">
            {tabs.map((tab, index) => (
              <CNavItem>
                <CNavLink
                  active={activeKey === tab.active}
                  onClick={() => {setActiveKey(tab.active);setCurrentTabIndex(index);}}
                >
                  {tab.name}
                </CNavLink>
              </CNavItem>
            ))}
          </CNav>
          <br />
          <CTabContent>
            <div>{renderTabPanel()}</div>
          </CTabContent>
        </>
      )
}

export default InstantSubOption