import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from 'react-router-dom'
import Layout from './Layout';
import { useForm } from 'react-hook-form'

export default function Department() {
    const navigate = useNavigate()
    const [departmentList, setDepartmentList] = useState('')

    function handleSession() {
        toast.error('Session expired, please login')
        localStorage.removeItem("accessToken");

        setTimeout(() => {
            navigate('/login')
        }, 1000);
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

    useEffect(() => { fetchDepartments() }, [])

    const { register, handleSubmit, formState: { errors }, setValue, resetField } = useForm()
    // Create a New Department
    const handleCreateDept = async (data) => {
        const accessToken = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : handleSession();
        const url = "http://localhost:3001/dept";
        axios.post(url, data, { headers: { Authorization: `${accessToken}` } })
            .then(res => {
                toast.success(res.data.message);
                fetchDepartments();
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
    }

    // Delete a Department
    const handleDelete = async (id) => {
        const accessToken = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : handleSession();
        const url = `http://localhost:3001/dept/${id}`;
        axios.delete(url, { headers: { Authorization: `${accessToken}` } })
            .then(res => {
                // Only accept 200 responses
                toast.success(res.data.message);
                fetchDepartments();
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.status == 403 || err.response.status == 400) {
                        toast.warning(err.response.data.message);
                    }
                } else {
                    handleSession();
                    console.log(err);
                }
            })
    }

    const handleUpdateModal = (e) => {
        let deptName = document.getElementById('updateDeptName');
        deptName.innerText = e.target.dataset.name;
        setValue('id', e.target.id)
        setValue('name', e.target.dataset.name)
    }

    // Update a Department
    const handleUpdate = (data) => {
        const accessToken = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : handleSession();
        const url = `http://localhost:3001/dept/${data.id}`;
        axios.put(url,{name: data.name}, { headers: { Authorization: `${accessToken}` } })
            .then(res => {
                // Only accept 200 responses
                console.log(res);
                toast.success(res.data.message);
                fetchDepartments();
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.status == 403 || err.response.status == 400) {
                        toast.warning(err.response.data.message);
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
                    List Here Department
                </h4>
                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createDepartmentModal">
                    Create Department
                </button>
                <table border={1} width={'100%'}>
                    <thead>
                        <tr><th>Name</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                        {
                            departmentList != ""
                                ? departmentList.map((department, key) => {
                                    return (
                                        <tr key={key}>
                                            <td>{department.name}</td>
                                            <td>
                                                <button type="button" className="btn btn-primary mx-2"
                                                    onClick={() => {
                                                        handleDelete(department._id)
                                                    }}>Delete</button>

                                                <button
                                                    type="button"
                                                    id={department._id}
                                                    data-name={department.name}
                                                    className="btn btn-primary"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#updateDepartmentModal"
                                                    onClick={(e) => {
                                                        handleUpdateModal(e)
                                                    }}>Edit</button>
                                            </td>
                                        </tr>
                                    )
                                })
                                : <tr className='text-center'><td colSpan={4}>Loading...</td></tr>
                        }
                    </tbody>
                </table>
                <ToastContainer />
            </div>

            {/* Create Department Modal Here */}
            <div className="modal fade" id="createDepartmentModal" tabIndex="-1" aria-labelledby="createDepartmentModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="createDepartmentModalLabel">Create New Department</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit(handleCreateDept)}>
                                Name
                                <br />
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    {...register("name", { required: true })}
                                />
                                {errors.name && <span className='text-danger'>Required</span>}
                                <br />
                                <input type="submit" value="Submit" data-bs-dismiss="modal" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Department Modal Here */}
            <div className="modal fade" id="updateDepartmentModal" tabIndex="-1" aria-labelledby="updateDepartmentModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="updateDepartmentModalLabel">Updating "<span id='updateDeptName'></span>"</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit(handleUpdate)}>
                                <input type="hidden" id='updateDeptId' {...register("id", { required: true })} />
                                Name
                                <br />
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    {...register("name", { required: true })}
                                />
                                {errors.name && <span className='text-danger'>Required</span>}
                                <br />
                                <input type="submit" value="Submit" data-bs-dismiss="modal" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
