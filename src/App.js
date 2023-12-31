import './App.css';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Employee from './Pages/Employee';
import Manager from './Pages/Manager';
import ProtectedRoute from './Pages/ProtectedRoute';
import { Route, Routes } from 'react-router-dom';
import React, {  } from 'react';
import "react-toastify/dist/ReactToastify.css";
import ExploreUser from './Pages/ExploreUser';
import Department from './Pages/Department';

function App() {


  return (
    <Routes>
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />

      <Route path='/' element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />

      <Route path='/employee' element={
        <ProtectedRoute managerRoute={true}>
          <Employee />
        </ProtectedRoute>
      } />

      <Route path='/manager' element={
        <ProtectedRoute>
          <Manager />
        </ProtectedRoute>
      } />

      <Route path='/user/:id' element={
        <ProtectedRoute>
          <ExploreUser />
        </ProtectedRoute>
      } />

      <Route path='/department' element={
        <ProtectedRoute>
          <Department />
        </ProtectedRoute>
      } />


    </Routes>
  );
}

export default App;
