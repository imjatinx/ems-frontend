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
        console.log(data);
        axios.post(url, data)
            .then(res => {
                toast.update(sign_up_status, { render: res.data.message, type: "success", isLoading: false });
                setTimeout(() => {
                    navigate('/login')
                }, 1000);
            })
            .catch(err => {
                toast.update(sign_up_status, {
                    render: err.response !== undefined
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
                        <h5 className="card-title text-center">Create an Account</h5>
                        <hr />
                        <form onSubmit={handleSubmit(handleSignUpForm)}>
                            <div className="row">
                                <div className="col-md-6 mb-1">
                                    <input type="text" className="form-control" placeholder="Name"
                                        {...register("name", { required: true })} />
                                    {errors.name && <span className='text-danger'>Required</span>}
                                </div>
                                <div className="col-md-6 mb-1">
                                    <input type="text" className="form-control" placeholder="Username"
                                        {...register("username", { required: true })} />
                                    {errors.username && <span className='text-danger'>Required</span>}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-1">
                                    <input type="email" className="form-control" placeholder="Email"
                                        {...register("email", { required: true })} />
                                    {errors.email && <span className='text-danger'>Required</span>}
                                </div>
                                <div className="col-md-6 mb-1">
                                    <input type="password" className="form-control" placeholder="Password"
                                        {...register("password", { required: true })} />
                                    {errors.password && <span className='text-danger'>Required</span>}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 mb-1">
                                    <input type="text" className="form-control" placeholder="Location"
                                        {...register("location", { required: true })} />
                                    {errors.location && <span className='text-danger'>Required</span>}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-1">
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="role" id="role1" value="employee" checked
                                        {...register("role", { required: true })}/>
                                        <label className="form-check-label" htmlFor="role1">Employee</label>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-1">
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="role" id="role2" value="manager"
                                        {...register("role", { required: true })}/>
                                        <label className="form-check-label" htmlFor="role2">Manager</label>
                                    </div>
                                </div>
                                {errors.role && <span className='text-danger'>Required</span>}
                            </div>
                            <div className="d-grid gap-2">
                                <button className="btn btn-primary" type="submit">Create</button>
                            </div>
                            <div className="d-grid gap-2 my-3">
                                <Link className="text-dark" to={'/login'}>Already have an account?</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer autoClose={1000}/>
        </>
    )
}
