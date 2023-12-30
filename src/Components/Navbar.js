import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar({ userRole }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate('/login');
  }
  return (
    <div>
      {
        userRole == 'manager' ?
          <>
            <Link to={'/manager'}>Manager</Link>
            <Link to={'/employee'}>Employees</Link>
          </>
          : ''
      }
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
