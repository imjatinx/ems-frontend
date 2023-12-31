import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Layout from './Layout'
import { ToastContainer, toast } from 'react-toastify';

export default function ProtectedRoute({ children }) {
    const navigate = useNavigate()
    const [profile, setProfile] = useState('');

    function handleSession() {
        toast.error('Session expired, please login')

        setTimeout(() => {
            navigate('/login')
        }, 1000);
    }

    const fetchProfile = () => {
        const accessToken = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : handleSession();
        if (!accessToken) {
            return (<Navigate to={'/login'} />)
        }
        const url = "http://localhost:3001/user/profile";
        if (accessToken) {
            axios.get(url, { headers: { Authorization: `${accessToken}` } })
                .then(res => {
                    setProfile(res.data.profile)
                })
                .catch(err => {
                    console.log('Errror', err);
                    toast.error('Something went wrong')
                })
        }
    }

    useEffect(() => { fetchProfile() }, [])

    return (
        <>
            <Layout userRole={profile != '' ? profile.role : ''} >
                {children}
                <ToastContainer />
            </Layout>
        </>
    )

}
