import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
const userType = localStorage.getItem('type');

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
]

if(userType == 'Masteradmin'){
  const masteradminNav = 
    {
      component: CNavItem,
      name: 'Packages',
      to: '/packages/list',
      icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    }
  _nav.push(masteradminNav);

  const companyNav = {
    component: CNavItem,
    name: 'Companies',
    to: '/company/list',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  }
  _nav.push(companyNav);
}else if(userType == 'Company'){
  // const groupNav = {
  //   component: CNavItem,
  //   name: 'Group',
  //   to: '/group/list',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  // }
  // _nav.push(groupNav);

  const instantNav = {
    component: CNavItem,
    name: 'Instance',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    to: '/instance/list',
  }
  _nav.push(instantNav);

  // const messageNav = {
  //   component: CNavItem,
  //   name: 'Messages',
  //   icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
  //   to: '/message/list',
  // }
  // _nav.push(messageNav);
}

export default _nav
