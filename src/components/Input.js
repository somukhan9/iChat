import React, { useState } from 'react'
import Attach from '../img/attach.png'
import { useChatContext } from '../context/ChatContext'
import { useAuthContext } from '../context/AuthContext'
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore'
import { db, storage } from '../firebase'
import { v4 as uuid } from 'uuid'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

const Input = () => {
  const [text, setText] = useState('')
  const [img, setImg] = useState(null)
  const [loading, setLoading] = useState(false)

  const { chatState } = useChatContext()
  const { currentUser } = useAuthContext()

  const handleSend = async () => {
    setLoading(true)
    try {
      if (img) {
        // Saving the Display Picture to the Cloud Storage
        const sendImgRef = ref(storage, `${uuid()}`)
        const uploadTask = uploadBytesResumable(sendImgRef, img)
        uploadTask.on(
          'state_changed',
          (snapshot) => {},
          (error) => {
            console.log(error)
          },
          () => {
            getDownloadURL(sendImgRef).then(async (downloadURL) => {
              await updateDoc(doc(db, 'Chat', chatState.chatID), {
                messages: arrayUnion({
                  id: uuid(),
                  senderID: currentUser.uid,
                  text,
                  date: Timestamp.now(),
                  img: downloadURL,
                }),
              })
              setLoading(false)
            })
          }
        )
      } else {
        await updateDoc(doc(db, 'Chat', chatState.chatID), {
          messages: arrayUnion({
            id: uuid(),
            senderID: currentUser.uid,
            text,
            date: Timestamp.now(),
          }),
        })

        await updateDoc(doc(db, 'UserChat', currentUser.uid), {
          [chatState.chatID + '.lastMessage']: { text },
          [chatState.chatID + '.data']: serverTimestamp(),
        })

        await updateDoc(doc(db, 'UserChat', chatState.user.uid), {
          [chatState.chatID + '.lastMessage']: { text },
          [chatState.chatID + '.data']: serverTimestamp(),
        })
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }

    setText('')
    setImg(null)
  }

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="send">
        <input
          type="file"
          name="imgFile"
          id="imgFile"
          style={{ display: 'none' }}
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="imgFile">
          <img src={Attach} alt="" />
          {img && <span>{img.name}</span>}
        </label>
        <button onClick={handleSend}>{loading ? 'Sending...' : 'Send'}</button>
      </div>
    </div>
  )
}

export default Input
