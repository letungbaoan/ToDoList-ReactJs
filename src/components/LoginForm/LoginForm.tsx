import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import styles from './loginForm.module.scss'

const LoginForm = () => {
  const provider = new GoogleAuthProvider()

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      console.log('User signed in: ', user)
    } catch (error) {
      console.error('Error during Google sign-in:', error)
    }
  }

  return (
    <button className={styles.googleLoginButton} onClick={handleLogin}>
      Sign in with Google
    </button>
  )
}

export default LoginForm
