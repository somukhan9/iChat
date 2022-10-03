import React, { useEffect, useRef } from 'react'
import { useAuthContext } from '../context/AuthContext'
import { useChatContext } from '../context/ChatContext'

const Message = ({ message }) => {
  const { currentUser } = useAuthContext()
  const { chatState } = useChatContext()
  const ref = useRef()

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }, [message])

  return (
    <div
      className={`message ${message.senderID === currentUser.uid && 'owner'}`}
      ref={ref}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderID === currentUser.uid
              ? currentUser.photoURL
              : chatState.user.photoURL
          }
          alt=""
        />
        <span>just now</span>
      </div>
      <div className="messageContent">
        {message.text && <p>{message.text}</p>}
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  )
}

export default Message
