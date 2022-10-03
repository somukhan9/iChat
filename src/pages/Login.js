import { signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import Error from '../components/Error'

const Login = () => {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState({
    email: '',
    password: '',
  })

  const handleOnChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, user.email, user.password)
      navigate('/')
      setLoading(false)
    } catch (error) {
      console.log(error)
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">iChat</span>
        <span className="title">Loign</span>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email Address"
            value={user.email}
            onChange={handleOnChange}
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={user.password}
            onChange={handleOnChange}
          />

          <button>{loading ? 'Signing in...' : 'Sign in'}</button>
          {error && <Error error={error} setError={setError} />}
        </form>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
