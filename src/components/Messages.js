import { doc, onSnapshot } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useChatContext } from '../context/ChatContext'
import { db } from '../firebase'
import Message from './Message'

const Messages = () => {
  const [messages, setMessages] = useState([])
  const { chatState } = useChatContext()

  useEffect(() => {
    const getMessages = () => {
      const unsubscribe = onSnapshot(
        doc(db, 'Chat', chatState.chatID),
        (doc) => {
          doc.exists() && setMessages(doc.data().messages)
        }
      )

      return () => {
        unsubscribe()
      }
    }
    chatState.chatID && getMessages()
  }, [chatState.chatID])

  return (
    <div className="messages">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  )
}

export default Messages
