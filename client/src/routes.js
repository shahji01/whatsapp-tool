import React,{useEffect} from 'react'
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const CompanyAdd = React.lazy(() => import('./views/company/add'))
const CompanyList = React.lazy(() => import('./views/company/list'))
const UserList = React.lazy(() => import('./views/user/list'))
const InstanceList = React.lazy(() => import('./views/instance/list'))
const GroupAdd = React.lazy(() => import('./views/group/add'))
const GroupList = React.lazy(() => import('./views/group/list'))
const PackagesAdd = React.lazy(() => import('./views/packages/add'))
const PackagesList = React.lazy(() => import('./views/packages/list'))
const MessageAdd = React.lazy(() => import('./views/message/add'))
const MessageList = React.lazy(() => import('./views/message/list'))
const InstanceIndex = React.lazy(() => import('./views/instance/index'))


const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/company/add', name: 'Add Company', element: CompanyAdd },
  { path: '/company/list', name: 'Companies List', element: CompanyList },
  { path: '/group/add', name: 'Add Group', element: GroupAdd },
  { path: '/group/list', name: 'Group List', element: GroupList },
  { path: '/message/add/:instanceToken', name: 'Add Message', element: MessageAdd },
  { path: '/message/list', name: 'Message List', element: MessageList },
  { path: '/packages/add', name: 'Add Package', element: PackagesAdd },
  { path: '/packages/list', name: 'Packages List', element: PackagesList },
  { path: '/user/list', name: 'Users List', element: UserList },
  { path: '/instance/list', name: 'Instance List', element: InstanceList },
  { path: '/instance/index', name: 'Instance', element: InstanceIndex },
  
]

export default routes
