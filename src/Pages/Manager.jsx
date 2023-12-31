import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from 'react-router-dom'
import Layout from './Layout';
import { useForm } from 'react-hook-form'

export default function Manager() {
    const navigate = useNavigate()
    const [managerList, setManagerList] = useState('')
    const [departmentList, setDepartmentList] = useState('')


    function handleSession() {
        toast.error('Session expired, please login')
        localStorage.removeItem("accessToken");

        setTimeout(() => {
            navigate('/login')
        }, 1000);
    }

    // Fetch all Managers
    const fetchManagers = () => {
        const accessToken = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : handleSession();
        const url = "http://localhost:3001/user/manager";
        if (accessToken) {
            axios.get(url, { headers: { Authorization: `${accessToken}` } })
                .then(res => {
                    setManagerList(res.data.managers)
                })
                .catch(err => {
                    handleSession();
                    console.log(err);
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

    const { register, handleSubmit, formState: { errors }, resetField } = useForm()
    // Create a New Manager at manager end
    const handleCreateManager = async (data) => {
        const accessToken = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : handleSession();
        const url = "http://localhost:3001/user/createuser";
        axios.post(url, data, { headers: { Authorization: `${accessToken}` } })
            .then(res => {
                toast.success(res.data.message);
                fetchManagers();
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.status == 409 || err.response.status == 400) {
                        toast.warning(err.response.data.message);
                    }
                } else {
                    handleSession();
                    console.log(err);
                }
            })
        resetField("name");
        resetField("username");
        resetField("email");
        resetField("location");
        resetField("department");
        resetField("password");
    }

    useEffect(() => { fetchManagers() }, [])

    // Delete a Manager
    const handleDeleteManager = async (id) => {
        const accessToken = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : handleSession();
        const url = `http://localhost:3001/user/${id}`;
        axios.delete(url, { headers: { Authorization: `${accessToken}` } })
            .then(res => {
                toast.success(res.data.message);
                fetchManagers();
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.status == 400) {
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

    return (
        <>
            <div>
                <h4>
                    List Here Manager
                </h4>
                <form method="post">
                    <input type="search" name="search" placeholder='search' />
                    <input type="text" name='location' placeholder='location' />
                    <input type="submit" value="filter" />
                </form>
                <button type="button" className="btn btn-primary" data-bs-toggle="modal"
                    onClick={() => {
                        fetchDepartments()
                    }}
                    data-bs-target="#createManagerModal">
                    Create Manager
                </button>
                <table border={1} width={'100%'}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Location</th>
                            <th>Department</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            managerList != ""
                                ? managerList.map((manager, key) => {
                                    return (
                                        <tr key={key}>
                                            <td>{manager.name}</td>
                                            <td>{manager.username}</td>
                                            <td>{manager.email}</td>
                                            <td>{manager.location}</td>
                                            <td>{manager.department.name}</td>
                                            <td>
                                                <Link to={`/user/${manager._id}`}>Explore</Link>
                                                <button onClick={() => {
                                                    handleDeleteManager(manager._id);
                                                }}>Delete</button>
                                            </td>
                                        </tr>
                                    )
                                })
                                : <tr className='text-center'><td colSpan={6}>No Manager...</td></tr>
                        }
                    </tbody>
                </table>
            </div>

            {/* Create Manager Modal Here */}
            <div className="modal fade" id="createManagerModal" tabIndex="-1" aria-labelledby="createManagerModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="createManagerModalLabel">Create New Manager</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form method="post" onSubmit={handleSubmit(handleCreateManager)}>
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
                                <input type="hidden" name="role" id="role" value={'manager'} {...register("role", { required: true })}
                                />
                                {errors.username && <span className='text-danger'>Required</span>}
                                <br />
                                Email
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
                                Department
                                <br />
                                <select name="department" id="" {...register("department", { required: true })}>
                                    {
                                        departmentList ?
                                            departmentList.map((department, key) => {
                                                return (
                                                    <option key={key} value={department.name}>{department.name}</option>
                                                )
                                            }) : <option>Loading...</option>
                                    }
                                </select>
                                {errors.department && <span className='text-danger'>Required</span>}
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
                                <input type="submit" value="Submit" data-bs-dismiss="modal" />
                                <ToastContainer />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}
