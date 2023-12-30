import React from 'react'
import Navbar from '../Components/Navbar'

export default function Layout({userRole, children }) {
    return (
        <div>
            <Navbar userRole={userRole}/>
            <div style={{padding:'20px'}}>{children}</div>
        </div>
    )
}
