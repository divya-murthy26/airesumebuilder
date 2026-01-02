import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import Preview from "./pages/Preview";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    return (
        <AuthProvider>
          <ToastContainer position="bottom-right" />
          <Routes>
            {/* Public Routes */}
            <Route path='/' element={<Home/>} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/auth' element={<Navigate to="/login" replace />} />
            <Route path='view/:resumeId' element={<Preview/>} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path='app' element={<Layout/>}>
                <Route index element={<Dashboard/>}/>
                <Route path='builder/:resumeId' element={<ResumeBuilder/>}/>
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
    )
  }

  export default App

  //