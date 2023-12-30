import React, { useState } from 'react'
import Layout from './Layout'

export default function Employee() {
  const [profile, setProfile] = useState({role:'manager'})
  return (
    <Layout userRole={profile != '' ? profile.role : ''}>
        List Here Employee
    </Layout>
  )
}
