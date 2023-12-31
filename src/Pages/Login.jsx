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
    <div style={{ display: 'flex', justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div>
        <h4>Login </h4>
        <form method="post" onSubmit={handleSubmit(handleLoginForm)}>
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
        <Link to={'/signup'}>Signup</Link>
      </div>
    </div>
  )
}
