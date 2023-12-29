import React from 'react'
import Navbar from '../Components/Navbar'

export default function Layout({ children }) {
    return (
        <div>
            <Navbar />
            <div style={{padding:'20px'}}>{children}</div>
        </div>
    )
}
