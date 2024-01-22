import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { RxEyeOpen } from "react-icons/rx";
import { MdOutlineDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { TbFilterDown, TbFilterUp } from "react-icons/tb";

export default function Employee() {
    const navigate = useNavigate()
    const [employeeList, setEmployeeList] = useState('')
    const [departmentList, setDepartmentList] = useState('')
    const [locationFilter, setLocationFilter] = useState(false)
    const [empFilter, setEmpFilter] = useState(false)


    function handleSession() {
        toast.error('Session expired, please login')
        localStorage.removeItem("accessToken");

        setTimeout(() => {
            navigate('/login')
        }, 1000);
    }

    // Fetch all Employees
    const handleFilter = (filter = '') => {
        let sort = ''
        let emp = ''
        if (filter.sort !== undefined) {
            if (locationFilter === true) { sort = 'desc' } else { sort = 'asc' }
        }
        if (filter.emp !== undefined) {
            if (empFilter === true) { emp = 'desc' } else { emp = 'asc' }
        }
        fetchEmployees(sort, emp)
    }

    const fetchEmployees = (sort = '', emp = '') => {
        const accessToken = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : handleSession();
        let url = '';
        if (sort !== '') {
            url = `http://localhost:3001/user/employee${sort === '' ? "" : `?sort=${sort}`}`;
        }

        if (emp !== '') {
            url = `http://localhost:3001/user/employee?emp=${emp}`;
        }

        if (sort === '' && emp === '') {
            url = `http://localhost:3001/user/employee`;
        }
        if (accessToken) {
            axios.get(url, { headers: { Authorization: `${accessToken}` } })
                .then(res => {
                    setEmployeeList(res.data.employees)
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
    // Create a New Employee at manager end
    const handleCreateEmp = async (data) => {
        const accessToken = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : handleSession();
        const url = "http://localhost:3001/user/createuser";
        axios.post(url, data, { headers: { Authorization: `${accessToken}` } })
            .then(res => {
                toast.success(res.data.message);
                handleFilter();
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.status == 409 || err.response.status == 400) {
                        toast.warning(err.response.data.message);
                    } else {
                        toast.error(err.response.data.message);
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
        // resetField("department");
        resetField("password");
    }

    // Delete an Employee
    const handleDeleteEmp = async (id) => {
        const accessToken = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : handleSession();
        const url = `http://localhost:3001/user/${id}`;
        axios.delete(url, { headers: { Authorization: `${accessToken}` } })
            .then(res => {
                toast.success(res.data.message);
                handleFilter();
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

    useEffect(() => {
        handleFilter()
    }, [])

    return (
        <>
            <div>
                <div className="row d-flex justify-content-between">
                    <div className="col-md-6">
                        <h4>
                            All Employees <IoMdAdd style={{ cursor: 'pointer' }} data-bs-toggle="modal" data-bs-target="#createEmployeeModal"
                                onClick={() => {
                                    fetchDepartments()
                                }} />
                        </h4>
                    </div>
                    <div className="col-md-6 d-flex justify-content-around align-items-center">
                        <span style={{ cursor: 'pointer' }} onClick={(e) => {
                            setLocationFilter(!locationFilter)
                            handleFilter({ sort: true });
                        }}>Location {locationFilter ? <TbFilterUp /> : <TbFilterDown />}</span>

                        <span style={{ cursor: 'pointer' }} onClick={(e) => {
                            setEmpFilter(!empFilter)
                            handleFilter({ emp: true });
                        }}>Name {empFilter ? <TbFilterUp /> : <TbFilterDown />}</span>
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
                                employeeList !== ""
                                    ? employeeList.map((employee, key) => {
                                        return (
                                            <tr key={key}>
                                                <td>{employee.name}</td>
                                                <td>{employee.username}</td>
                                                <td>{employee.email}</td>
                                                <td>{employee.location}</td>
                                                <td>{employee.department.name}</td>
                                                <td>
                                                    <Link to={`/user/${employee._id}`}>
                                                        <RxEyeOpen className='fs-3' />
                                                    </Link>
                                                </td>
                                                <td>
                                                    <MdOutlineDelete className='fs-3' style={{ cursor: 'pointer' }} onClick={() => {
                                                        handleDeleteEmp(employee._id);
                                                    }} />
                                                </td>
                                            </tr>
                                        )
                                    })
                                    : <tr className='text-center'><td colSpan={7}>No Employee loaded...</td></tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            <ToastContainer autoClose={1000} />
            {/* Create Employee Modal Here */}
            <div className="modal fade" id="createEmployeeModal" tabIndex="-1" aria-labelledby="createEmployeeModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="createEmployeeModalLabel">Create New Employee</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit(handleCreateEmp)}>
                                <input type="hidden" name="role" id="role" value={'employee'} {...register("role", { required: true })} />
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
                                    <button className="btn btn-primary" type="submit">Create Employee</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}
