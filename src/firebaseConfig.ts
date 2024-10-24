import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAeEftV5MzE0H1XdoX35aNFBEN3CgQX_O0',
  authDomain: 'todolist-2e2ea.firebaseapp.com',
  projectId: 'todolist-2e2ea',
  storageBucket: 'todolist-2e2ea.appspot.com',
  messagingSenderId: '144253648699',
  appId: '1:144253648699:web:9d3ba8e361e230b166c11e',
  measurementId: 'G-8NWCTBE5CD'
}

const app = initializeApp(firebaseConfig)
export const database = getFirestore(app)
export const auth = getAuth(app)
