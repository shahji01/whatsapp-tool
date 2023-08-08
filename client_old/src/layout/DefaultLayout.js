import React,{Suspense} from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import Loader from '../components/Loader';
const DefaultLayout = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <Suspense fallback={Loader}>
            <AppContent />
          </Suspense>
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
