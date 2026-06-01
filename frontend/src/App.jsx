import React from 'react'
import Login from './components/user/Login'
import Signup from './components/user/Signup'

import Dashboard from './components/dashboard/Dashboard'
import ForgotPassword from './components/user/ForgetPassword'
import {Routes,Route} from 'react-router-dom'



const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/dashboard' element={<Dashboard/>}></Route>
        
        <Route path='/forget' element={<ForgotPassword/>}></Route>

      </Routes>
    </div>
  )
}

export default App