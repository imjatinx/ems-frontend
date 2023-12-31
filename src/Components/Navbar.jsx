import React from 'react'
import { Link, useNavigate, NavLink } from 'react-router-dom'

export default function Navbar({ userRole }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate('/login');
  }
  return (
    <>
      {/* <div style={{ display: 'flex', justifyContent: 'space-between', padding: "10px", background: 'gray' }}>
        <Link to={'/'}>Profile</Link>
        {
          userRole == 'manager' ?
            <>
              <Link to={'/employee'}>Employees</Link>
              <Link to={'/manager'}>Manager</Link>
              <Link to={'/department'}>Department</Link>
            </>
            : ''
        }
        <button onClick={handleLogout}>Logout</button>
      </div> */}

      {/* ------------------- */}
      <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">EMS</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" aria-current="page" to="/">Profile</NavLink>
              </li>
              {
                userRole == 'manager' ?
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
              <button class="btn btn-sm btn-outline-danger" onClick={handleLogout}>Logout</button>
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}
