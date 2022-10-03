import React, { useState } from 'react'
import Avatar from '../img/addAvatar.png'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { setDoc, doc } from 'firebase/firestore'
import { auth, storage, db } from '../firebase'
import { useNavigate, Link } from 'react-router-dom'
import Error from '../components/Error'

const Register = () => {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Creating the USER
      const res = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password
      )
      // Saving the Display Picture to the Cloud Storage
      const displayPictureRef = ref(storage, `${res.user.uid}`)
      const uploadTask = uploadBytesResumable(displayPictureRef, file)
      uploadTask.on(
        'state_changed',
        (snapshot) => {},
        (error) => {
          console.log(error)
          setError(error)
        },
        () => {
          getDownloadURL(displayPictureRef).then(async (downloadURL) => {
            // Updating the Profile
            await updateProfile(res.user, {
              displayName: user.name,
              photoURL: downloadURL,
            })
            // Saving the User Data to the FireStore
            await setDoc(doc(db, 'User', res.user.uid), {
              uid: res.user.uid,
              displayName: res.user.displayName,
              email: res.user.email,
              photoURL: res.user.photoURL,
            })

            // Creating collection for User Chat for Registered User
            await setDoc(doc(db, 'UserChat', res.user.uid), {})

            // Navigating in to the Home Page
            navigate('/')
            setLoading(false)
          })
        }
      )
      // console.log(res.user)
    } catch (error) {
      console.error(error)
      setError(error)
      setLoading(false)
    }
  }

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">iChat</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Display Name"
            value={user.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email Address"
            value={user.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
          />
          <input
            type="file"
            name="displayPicture"
            id="displayPicture"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label htmlFor="displayPicture">
            <img src={Avatar} alt="" />
            <span>Display Picture</span>
          </label>
          <button>{loading ? 'Signing up...' : 'Sign Up'}</button>
          {error && <Error error={error} setError={setError} />}
          <p>
            Do you have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register
