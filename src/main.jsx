import React from 'react'
import ReactDOM from 'react-dom/client'
import  ColorPicker  from './components/color_picker.jsx'
import Navbar from './components/navbar.jsx'
import MainDashboard from './Dashboard.jsx'
import './index.css'




ReactDOM.createRoot(document.getElementById('root')).render(
  
  <React.StrictMode>
    {/* <Navbar />
    <ColorPicker />
    <App /> */}
    <MainDashboard />
  </React.StrictMode>,
)
