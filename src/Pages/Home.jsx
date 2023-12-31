import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from 'react-router-dom'
import Layout from './Layout';

export default function Home() {
    const navigate = useNavigate()
    const [profile, setProfile] = useState('');
    function handleSession() {
        toast.error('Session expired, please login')
        localStorage.removeItem("accessToken");

        setTimeout(() => {
            navigate('/login')
        }, 1000);
    }

    const fetchProfile = () => {
        const accessToken = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : handleSession();
        const url = "http://localhost:3001/user/profile";
        if (accessToken) {
            axios.get(url, { headers: { Authorization: `${accessToken}` } })
                .then(res => {
                    setProfile(res.data.profile)
                    toast.success('Profile fetched successfully.')
                })
                .catch(err => {
                    handleSession();
                    console.log(err);
                })
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    return (
        <>
            Your Profile
            {
                profile != '' ?
                    <>
                        <li>Name: {profile.name}</li>
                        <li>Username: {profile.username}</li>
                        <li>Role: {profile.role}</li>
                        <li>Email: {profile.email}</li>
                        <li>Location: {profile.location}</li>
                        <li>Department: {!profile.department?'No Department':profile.department.name}</li>
                    </> : ''
            }
            <ToastContainer />
        </>
    )
}
