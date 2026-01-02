import React from 'react'
import {Link , useNavigate} from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const logoutUser = () => {
        logout()
        navigate('/'); 
    }
  return (
    <div className='shadow-bg-white'>
        <nav className='flex items-center justify-between h-16 
        max-w-screen-xl mx-auto px-4 text-slate-800 transition-all'>
            <Link to='/'>
                <img src="/logo.svg" alt="logoimg" className='h-11 w-auto' />
            </Link>
            <div className='flex items-center gap-4 text-sm'>
                {user ? (
                    <>
                        <p className='max-sm:hidden'>Hi, {user.name}</p>
                        <button onClick={logoutUser} className='bg-white  hover:bg-slate-50 border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all'>Logout</button>
                    </>
                ) : (
                    <Link to='/login' className='bg-white hover:bg-slate-50 border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all'>Login</Link>
                )}
            </div>
        </nav>
    </div>
  )
}

export default Navbar
