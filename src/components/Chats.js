import React, { useEffect, useState } from 'react'

import { useAuthContext } from '../context/AuthContext'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { useChatContext } from '../context/ChatContext'
import { ACTION_TYPES } from '../constants/action-types'

const Chats = () => {
  const [chats, setChats] = useState([])
  const { currentUser } = useAuthContext()
  const { dispatch } = useChatContext()

  useEffect(() => {
    const getChats = () => {
      const unsubscribe = onSnapshot(
        doc(db, 'UserChat', currentUser.uid),
        (doc) => {
          setChats(doc.data())
        }
      )

      return () => {
        unsubscribe()
      }
    }

    currentUser.uid && getChats()
  }, [currentUser.uid])

  const handleSelect = (user) => {
    dispatch({ type: ACTION_TYPES.CHANGE_USER, payload: { user } })
  }

  return Object.entries(chats)
    ?.sort((a, b) => b[1].data - a[1].data)
    .map((chat) => (
      <div
        className="chats"
        key={chat[0]}
        onClick={() => handleSelect(chat[1].userInfo)}
      >
        <div className="userChat">
          <img
            src={chat[1]?.userInfo?.photoURL}
            alt={chat[1]?.userInfo?.displayName}
          />
          <div className="userChatInfo">
            <span>{chat[1]?.userInfo?.displayName}</span>
            <p>{chat[1]?.lastMessage?.text}</p>
          </div>
        </div>
      </div>
    ))
}

export default Chats
