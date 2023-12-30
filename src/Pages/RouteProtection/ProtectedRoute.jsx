import { Route, Redirect, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Layout from '../Layout';

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState('');

    const handleSession = () => {
        toast.success('Session Expired! Please login again.');
        navigate('/login')
    }

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

    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {


        fetchProfile()
    } else {
        navigate('/login')
    }

    return (
        children
    );
};

export default ProtectedRoute;
