import axios from 'axios'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


export default function Signup() {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm()
    const handleSignUpForm = async (data) => {
        const sign_up_status = toast.loading("Please wait...")
        const url = "http://localhost:3001/auth/signup";
        axios.post(url, data)
            .then(res => {
                toast.update(sign_up_status, { render: res.data.message, type: "success", isLoading: false });
                setTimeout(() => {
                    navigate('/login')
                }, 1000);
            })
            .catch(err => {
                toast.update(sign_up_status, {
                    render: err.response != undefined
                        ? err.response.data.message
                        : 'Something went wrong',
                    type: "error", isLoading: false
                });
            })
    }
    return (
        <div style={{ display: 'flex', justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <div>
                <h4>Signup</h4>
                <form method="post" onSubmit={handleSubmit(handleSignUpForm)}>
                    name
                    <br />
                    <input
                        type="text"
                        name="name"
                        id="name"
                        {...register("name", { required: true })}
                    />
                    {errors.name && <span className='text-danger'>Required</span>}
                    <br />
                    username
                    <br />
                    <input
                        type="text"
                        name="username"
                        id="username"
                        {...register("username", { required: true })}
                    />
                    {errors.username && <span className='text-danger'>Required</span>}
                    <br />
                    email
                    <br />
                    <input
                        type="email"
                        name="email"
                        id="email"
                        {...register("email", { required: true })}
                    />
                    {errors.email && <span className='text-danger'>Required</span>}
                    <br />
                    Location
                    <br />
                    <input
                        type="text"
                        name="location"
                        id="location"
                        {...register("location", { required: true })}
                    />
                    {errors.location && <span className='text-danger'>Required</span>}
                    <br />
                    password
                    <br />
                    <input
                        type="password"
                        name="password"
                        id="password"
                        {...register("password", { required: true })}
                    />
                    {errors.password && <span className='text-danger'>Required</span>}
                    <br />
                    <input type="submit" value="Submit" />
                    <ToastContainer />
                </form>
                <Link to={'/login'}>Login</Link>
            </div>
        </div>
    )
}
