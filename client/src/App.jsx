import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route } from 'react-router-dom'
import LoginPage from '../pages/login'
import Clientdashboard from '../pages/userDashboard'
import AdminDashboard from '../pages/adminDashboard'
import './App.css'

function App() {
 return (<>
   <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route path='/client' element={<Clientdashboard />} />
      <Route path='/admin' element={<AdminDashboard />} />
   </Routes>
   </>)
}

export default App
