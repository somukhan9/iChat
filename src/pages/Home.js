import React from 'react'
import Chat from '../components/Chat'
import Sidebar from '../components/Sidebar'
import { useChatContext } from '../context/ChatContext'

const Welcome = () => {
  return (
    <div className="welcome">
      <h4>Select a User to start conversation</h4>
    </div>
  )
}

const Home = () => {
  const { chatState } = useChatContext()

  return (
    <div className="home">
      <div className="container">
        <Sidebar />
        {chatState.chatID ? <Chat /> : <Welcome />}
      </div>
    </div>
  )
}

export default Home
