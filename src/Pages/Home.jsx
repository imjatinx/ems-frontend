import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from 'react-router-dom'
import Layout from './Layout';


export default function Home() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState('');

  const handleSession = () => {
    toast.success('Session Expired! Please login again.');
    navigate('/login')
  }

  // function handleNotification(msg, code) {
  //   const id = toast.error(msg);
  //   console.log('called');
  //   if (code == 'error') {
  //   }
  //   if (code == 'success') {
  //     toast.success(msg);
  //   }
  // }

  const fetchProfile = () => {
    const accessToken = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : handleSession();
    const url = "http://localhost:3001/user/profile";
    axios.get(url, { headers: { Authorization: `${accessToken}` } })
      .then(res => {
        setProfile(res.data.profile)
      })
      .catch(err => {
        console.log(err);
      })
  }

  fetchProfile()

  return (
    <>
      <Layout userRole={profile != '' ? profile.role : ''}>
        Your Profile
        {
          profile != '' ?
            <>
              <li>Name: {profile.name}</li>
              <li>Username: {profile.username}</li>
              <li>Role: {profile.role}</li>
              <li>Department: {profile.department.name}</li>
            </> : ''
        }
      </Layout>
    </>
  )
}
