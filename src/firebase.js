import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAG0DPo7KvDjVnpGtAW0FamalQLtb166B8',
  authDomain: 'messenger-clone-f7828.firebaseapp.com',
  projectId: 'messenger-clone-f7828',
  storageBucket: 'messenger-clone-f7828.appspot.com',
  messagingSenderId: '164434418192',
  appId: '1:164434418192:web:f7bd780b4b8c82e7e08895',
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth()
export const storage = getStorage()
export const db = getFirestore()
