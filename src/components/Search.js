import React, { useState } from 'react'
import {
  getDocs,
  doc,
  query,
  where,
  collection,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuthContext } from '../context/AuthContext'
import { useChatContext } from '../context/ChatContext'
import Error from './Error'
import { ACTION_TYPES } from '../constants/action-types'

const Search = () => {
  const [error, setError] = useState('')
  const [username, setUsername] = useState('')
  const [users, setUsers] = useState([])
  const { currentUser } = useAuthContext()
  const { dispatch } = useChatContext()

  const handleSearch = async () => {
    try {
      const q = query(
        collection(db, 'User'),
        where('displayName', '==', username)
      )
      const querySnapshot = await getDocs(q)

      let tempUsers = []
      querySnapshot.forEach((doc) => {
        if (doc.data().uid !== currentUser.uid) {
          tempUsers.push(doc.data())
        }
      })

      setUsers(tempUsers)
    } catch (error) {
      console.error(error)
      setError(error.message)
    }
  }

  const handleKey = (e) => {
    // e.code === 'Enter' && handleSearch()
    handleSearch()
  }

  const handleSelect = async (user) => {
    const combinedID =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid
    try {
      // Checking for Chat in Chats collection for combinedID
      const res = await getDoc(doc(db, 'Chat', combinedID))

      if (!res.exists()) {
        // Creating Chat in Chats collection with combinedID
        await setDoc(doc(db, 'Chat', combinedID), { messages: [] })

        // Creating User Chats in UserChats collection for current user
        await updateDoc(doc(db, 'UserChat', currentUser.uid), {
          [combinedID + '.userInfo']: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            email: user.email,
          },
          [combinedID + '.date']: serverTimestamp(),
        })

        // Creating User Chats in UserChats collection for another user
        await updateDoc(doc(db, 'UserChat', user.uid), {
          [combinedID + '.userInfo']: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            email: currentUser.email,
          },
          [combinedID + '.date']: serverTimestamp(),
        })
      } else {
        dispatch({ type: ACTION_TYPES.CHANGE_USER, payload: { user } })
      }

      setUsername('')
      setUsers([])
    } catch (error) {
      console.error(error)
      setError(error.message)
    }
  }

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Find a user"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          onKeyUp={handleKey}
        />
      </div>

      {error && <Error error={error} setError={setError} />}

      {users &&
        users.map((user, index) => (
          <div
            className="userChat"
            key={user.uid}
            onClick={() => {
              handleSelect(user)
            }}
          >
            <img src={user.photoURL} alt={user.displayName} />
            <div className="userChatInfo">
              <span>{user.displayName}</span>
            </div>
          </div>
        ))}
    </div>
  )
}

export default Search
