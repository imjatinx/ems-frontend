import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom'

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

            <div className="row">
                {
                    profile !== '' ?
                        <>
                            <div className="col-md-12 text-center fs-1">
                                Welcome, {profile.name}
                            </div>
                            <div className="col-md-6 mx-auto">
                                <p className='text-justify'>
                                    <span className='fw-bold'>BIO:</span>  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel dolorum delectus sed, fuga atque praesentium harum error.
                                </p>
                                <div className='text-justify d-flex justify-content-between'>
                                    <p><span className='fw-bold'>Username:</span> {profile.username}</p>
                                    <p><span className='fw-bold'>Email:</span> {profile.email}</p>
                                </div>
                                <div className='text-justify d-flex justify-content-between'>
                                    <p><span className='fw-bold'>Role:</span> {profile.role}</p>
                                    <p><span className='fw-bold'>Location:</span>Reporting at {profile.location} office</p>
                                </div>
                                <div className='text-justify d-flex justify-content-between'>
                                    <p>
                                        <span className='fw-bold'>Department:</span> {!profile.department ? 'No Department' : profile.department.name}
                                    </p>
                                </div>

                            </div>
                        </> :
                        <div className="col-md-12 border text-center fs-1">
                            Profile content not loaded...
                        </div>
                }
            </div>
            <ToastContainer autoClose={1000}/>
        </>
    )
}
