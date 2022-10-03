import { createContext, useContext, useReducer } from 'react'
import { ACTION_TYPES } from '../constants/action-types'
import { useAuthContext } from './AuthContext'

const ChatContext = createContext()

const INITIAL_STATE = {
  chatID: '',
  user: {},
}

const ChatProvider = ({ children }) => {
  const { currentUser } = useAuthContext()

  const chatReducer = (state, action) => {
    switch (action.type) {
      case ACTION_TYPES.CHANGE_USER:
        return {
          ...state,
          user: action.payload.user,
          chatID:
            currentUser.uid > action.payload.user.uid
              ? currentUser.uid + action.payload.user.uid
              : action.payload.user.uid + currentUser.uid,
        }
      default:
        throw Error('Invalid dispatch action.')
    }
  }

  const [chatState, dispatch] = useReducer(chatReducer, INITIAL_STATE)

  const values = {
    chatState,
    dispatch,
  }

  return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>
}

const useChatContext = () => {
  return useContext(ChatContext)
}

export { ChatProvider, useChatContext }
