import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { MdOutlineDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

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

    const { register, handleSubmit, formState: { errors }, resetField } = useForm()
    const { register: register2, formState: { errors: errors2 }, setValue, handleSubmit: handleSubmit2, } = useForm();
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
        axios.put(url, { name: data.name }, { headers: { Authorization: `${accessToken}` } })
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

    return (
        <>
            <div>
                <div className="row d-flex justify-content-between">
                    <div className="col-md-6">
                        <h4>
                            All Department <IoMdAdd style={{ cursor: 'pointer' }} data-bs-toggle="modal" data-bs-target="#createDepartmentModal"
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
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                departmentList != ""
                                    ? departmentList.map((department, key) => {
                                        return (
                                            <tr key={key}>
                                                <td>{department.name}</td>
                                                <td>

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
                                                <td>
                                                    <MdOutlineDelete className='fs-3' style={{ cursor: 'pointer' }}
                                                        onClick={() => {
                                                            handleDelete(department._id)
                                                        }} />
                                                </td>
                                            </tr>
                                        )
                                    })
                                    : <tr className='text-center'><td colSpan={3}>No Department loaded...</td></tr>
                            }
                        </tbody>
                    </table>
                </div>
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
                                <div className="row">
                                    <div className="col-md-12 mb-1">
                                        <input type="text" className="form-control" placeholder="Name"
                                            {...register("name", { required: true })} />
                                        {errors.name && <span className='text-danger'>Required</span>}
                                    </div>
                                </div>
                                <div className="d-grid gap-2">
                                    <button className="btn btn-primary" type="submit" data-bs-dismiss="modal">Create Department</button>
                                </div>
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
                            <form onSubmit={handleSubmit2(handleUpdate)}>
                                <input type="hidden" {...register2("id", { required: true })} />
                                <div className="row">
                                    <div className="col-md-12 mb-1">
                                        <input type="text" className="form-control" placeholder="Name"
                                            {...register2("name", { required: true })} />
                                        {errors2.name && <span className='text-danger'>Required</span>}
                                    </div>
                                </div>
                                <div className="d-grid gap-2">
                                    <button className="btn btn-primary" type="submit" data-bs-dismiss="modal">Update Department</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
