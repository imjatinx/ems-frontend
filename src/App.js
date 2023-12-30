import './App.css';
import Home from './Pages/Home';
import Layout from './Pages/Layout';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Employee from './Pages/Employee';
import Manager from './Pages/Manager';
import ProtectedRoute from './Pages/RouteProtection/ProtectedRoute';
import { Route, Routes, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function App() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState('');

  const handleSession = () => {
    toast.success('Session Expired! Please login again.');
    navigate('/login')
  }

  
  const fetchProfile = () => {
    const accessToken = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : handleSession();
    const url = "http://localhost:3001/user/profile";
    if (accessToken) {
      axios.get(url, { headers: { Authorization: `${accessToken}` } })
        .then(res => {
          setProfile(res.data.profile)
        })
        .catch(err => {
          console.log(err);
        })
      }
    }
    
    useEffect(() => {
      fetchProfile()
      console.log(profile);
    }, [])
    
  return (
    <Routes>
      <Route path='/signup' Component={Signup} />
      <Route path='/login' Component={Login} />
      <Route path='/employee' Component={Employee} />
      <Route path='/manager' Component={Manager} />
      <Route path='/' Component={<Home />} />
    </Routes>
  );
}

export default App;
