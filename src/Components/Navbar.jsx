import React from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function Navbar({ userRole }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    toast.success('Logout successful');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  }
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
        <div className="container-fluid">
          <span className="navbar-brand">Employee-Management</span>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" aria-current="page" to="/">Profile</NavLink>
              </li>
              {
                userRole === 'manager' ?
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link" aria-current="page" to='/employee'>Employees</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" aria-current="page" to='/manager'>Managers</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" aria-current="page" to='/department'>Departments</NavLink>
                    </li>
                  </>
                  : ''
              }
              <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>Logout</button>
            </ul>
          </div>
        </div>
      </nav>
      <ToastContainer autoClose={1000}/>
    </>
  )
}
