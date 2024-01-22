import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { RxEyeOpen } from "react-icons/rx";
import { MdOutlineDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

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
                <div className="row d-flex justify-content-between">
                    <div className="col-md-12">
                        <h4>
                            All Managers <IoMdAdd style={{ cursor: 'pointer' }} data-bs-toggle="modal" data-bs-target="#createManagerModal"
                                onClick={() => {
                                    fetchDepartments()
                                }} />
                        </h4>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className='table table-striped table-bordered mt-3'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Location</th>
                                <th>Department</th>
                                <th>Exlpore</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                managerList !== ""
                                    ? managerList.map((manager, key) => {
                                        return (
                                            <tr key={key}>
                                                <td>{manager.name}</td>
                                                <td>{manager.username}</td>
                                                <td>{manager.email}</td>
                                                <td>{manager.location}</td>
                                                <td>{manager.department.name}</td>
                                                <td>
                                                    <Link to={`/user/${manager._id}`}>
                                                        <RxEyeOpen className='fs-3' />
                                                    </Link>
                                                </td>
                                                <td>
                                                    <MdOutlineDelete className='fs-3' style={{ cursor: 'pointer' }} onClick={() => {
                                                        handleDeleteManager(manager._id);
                                                    }} />
                                                </td>
                                            </tr>
                                        )
                                    })
                                    : <tr className='text-center'><td colSpan={7}>No Manager loaded...</td></tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            <ToastContainer autoClose={1000}/>
            {/* Create Manager Modal Here */}
            <div className="modal fade" id="createManagerModal" tabIndex="-1" aria-labelledby="createManagerModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="createManagerModalLabel">Create New Manager</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit(handleCreateManager)}>
                                <input type="hidden" name="role" id="role" value={'manager'} {...register("role", { required: true })} />
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
                                </div>
                                <div className="row">
                                    <div className="col-md-12 mb-1">
                                        <input type="text" className="form-control" placeholder="Location"
                                            {...register("location", { required: true })} />
                                        {errors.location && <span className='text-danger'>Required</span>}
                                    </div>
                                </div>
                                <div className="d-grid gap-2">
                                    <button className="btn btn-primary" type="submit" data-bs-dismiss="modal">Create Employee</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}
