import axios from 'axios'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm()
    const handleLoginForm = async (data) => {
        const login_status = toast.loading("Please wait...")
        const url = "http://localhost:3001/auth/login";
        axios.post(url, data)
            .then(res => {
                localStorage.setItem("accessToken", `bearer ${res.data.token}`);
                toast.update(login_status, { render: res.data.message, type: "success", isLoading: false });
                setTimeout(() => {
                    navigate('/')
                }, 1000);
            })
            .catch(err => {
                toast.update(login_status, {
                    render: err.response != undefined
                        ? err.response.data.message
                        : 'Something went wrong',
                    type: "error", isLoading: false
                });
            })
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <div className="card" style={{ width: "25rem" }}>
                    <div className="card-body">
                        <h5 className="card-title text-center">Login to account</h5>
                        <hr />
                        <form onSubmit={handleSubmit(handleLoginForm)}>
                            <div className="row">
                                <div className="col-md-12 mb-1">
                                    <input type="text" className="form-control" placeholder="Username" {...register("username", { required: true })} />
                                    {errors.username && <span className='text-danger'>Required</span>}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 mb-1">
                                    <input type="password" className="form-control" placeholder="Password" {...register("password", { required: true })} />
                                    {errors.password && <span className='text-danger'>Required</span>}
                                </div>
                            </div>
                            <div className="d-grid gap-2">
                                <button className="btn btn-primary" type="submit">Login</button>
                            </div>
                            <div className="d-grid gap-2 my-3">
                                <Link className="text-dark" to={'/signup'}>Create new account</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}
