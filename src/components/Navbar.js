import React from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useAuthContext } from '../context/AuthContext'

const Navbar = () => {
  const { currentUser } = useAuthContext()

  const logout = async () => {
    await signOut(auth)
  }

  return (
    <div className="navbar">
      <span className="logo">iChat</span>
      <div className="user">
        <img src={currentUser.photoURL} alt="" />
        <span>{currentUser.displayName}</span>
        <button onClick={logout}>logout</button>
      </div>
    </div>
  )
}

export default Navbar
