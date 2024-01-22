import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'

export default function ExploreUser() {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: {
            username: '',
            name: '',
            email: '',
            location: '',
            role: '',
            department: '',
        },
    })
    const { id } = useParams()
    const navigate = useNavigate()
    const [user, setUser] = useState('')
    const [departmentList, setDepartmentList] = useState('')

    function handleSession() {
        toast.error('Session expired, please login')
        localStorage.removeItem("accessToken");

        setTimeout(() => {
            navigate('/login')
        }, 1000);
    }

    const fetchUser = () => {
        const accessToken = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : handleSession();
        const url = `http://localhost:3001/user/profile/${id}`;
        if (accessToken) {
            axios.get(url, { headers: { Authorization: `${accessToken}` } })
                .then(res => {
                    setUser(res.data.user)

                    // Set form values based on fetched user data
                    setValue('username', res.data.user.username);
                    setValue('name', res.data.user.name);
                    setValue('email', res.data.user.email);
                    setValue('location', res.data.user.location);
                    setValue('role', res.data.user.role);
                    setValue('department', res.data.user.department.name);
                    toast.success('User Profile Fetched')
                })
                .catch(err => {
                    if (err.response) {
                        if (err.response.status == 401 || err.response.status == 400) {
                            toast.warning(err.response.data.message);
                        } else {
                            toast.error(err.response.data.message);
                        }
                    } else {
                        handleSession();
                        console.log('===>', err);
                    }
                })
        }
    }

    // Fetch All Departments
    const fetchDepartments = () => {
        const accessToken = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : handleSession();
        const url = "http://localhost:3001/dept";
        if (accessToken) {
            axios.get(url, { headers: { Authorization: `${accessToken}` } })
                .then(res => {
                    setDepartmentList(res.data.departments)
                })
                .catch(err => {
                    handleSession();
                    console.log(err);
                })
        }
    }


    const handleUpdateUser = (data) => {
        const accessToken = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : handleSession();
        const url = "http://localhost:3001/user/update";
        if (accessToken) {
            axios.put(url, data, { headers: { Authorization: `${accessToken}` } })
                .then(res => {
                    toast.success(res.data.message);
                })
                .catch(err => {
                    if (err.response) {
                        if (err.response.status == 401 || err.response.status == 403) {
                            toast.warning(err.response.data.message);
                        } else {
                            toast.error(err.response.data.message);
                        }
                    } else {
                        handleSession();
                        console.log(err);
                    }
                })
        }
    }

    useEffect(() => {
        fetchUser()
        fetchDepartments()
    }, [])

    return (
        <div>
            <h4>Explore Profile, {user !== '' ? user.username : 'Profile content not loaded...'}</h4 >
            {
                user !== '' ?
                    <>
                        <form onSubmit={handleSubmit(handleUpdateUser)}>
                            <input type="hidden" name="" {...register("username", { required: true })} />
                            <div className="row">
                                <div className="col-md-6 mb-1">
                                    <input type="text" className="form-control" placeholder="Name"
                                        {...register("name", { required: true })} />
                                    {errors.name && <span className='text-danger'>Required</span>}
                                </div>
                                <div className="col-md-6 mb-1">
                                    <input type="email" className="form-control" placeholder="Email"
                                        {...register("email", { required: true })} />
                                    {errors.email && <span className='text-danger'>Required</span>}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-1">
                                    <select className="form-select" {...register("department", { required: true })}>
                                        {
                                            departmentList ?
                                                departmentList.map((department, key) => {
                                                    return (
                                                        <option key={key} value={department.name}>{department.name}</option>
                                                    )
                                                }) : <option>Loading...</option>
                                        }
                                    </select>
                                    {errors.location && <span className='text-danger'>Required</span>}
                                </div>
                                <div className="col-md-6 mb-1">
                                    <select className="form-select" {...register("role", { required: true })}>
                                        <option value="employee">Employee</option>
                                        <option value="manager">Manager</option>
                                    </select>
                                    {errors.role && <span className='text-danger'>Required</span>}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 mb-1">
                                    <input type="text" className="form-control" placeholder="Location"
                                        {...register("location", { required: true })} />
                                    {errors.location && <span className='text-danger'>Required</span>}
                                </div>
                            </div>
                            <div className="d-grid gap-2">
                                <button className="btn btn-primary" type="submit">Update Profile</button>
                            </div>
                        </form>
                    </> : ''
            }
            <ToastContainer autoClose={1000} />
        </div>
    )
}
