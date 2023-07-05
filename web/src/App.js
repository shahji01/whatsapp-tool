import React, { Component, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import './scss/style.scss'
import PrivateComponent from './components/PrivateComponent'
import Loader from './components/Loader';

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/auth/Login'))
const ForgetPassword = React.lazy(() => import('./views/auth/ForgetPassword'))
const CPWithOtp = React.lazy(() => import('./views/auth/CPWithOtp'))



class App extends Component {
  render() {
    return (
      
      <HashRouter>
        <Suspense fallback={Loader}>
          <Routes>
              <Route exact path="/login" name="Login Page" element={<Login />} />
              <Route exact path="/forgetPassword" name="Forget Password" element={<ForgetPassword />} />
              <Route exact path="/CPWithOtp" name="Change Password With Otp" element={<CPWithOtp />} />
            <Route element={< PrivateComponent/>}>
              <Route path="*" name="Home" element={<DefaultLayout />} />
            </Route>
          </Routes>
        </Suspense>
      </HashRouter>
      
    )
  }
}

export default App
