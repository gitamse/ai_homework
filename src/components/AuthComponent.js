import React, { useState, useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { auth } from './firebase'
import MainForm from './MainForm'
import Modal from './Modal'
import Coins from './Coins'
import { LoginForm, RegisterForm, ResetForm } from './Forms'
import { fetchRemainingRequests } from '../utils/fetchRemainingRequests'
import './AuthComponent.css'
import coin from '../data/coin.svg'

const AuthComponent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [modalType, setModalType] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [coins, setCoins] = useState(0)

  // Обновление количества монет
  const updateCoins = async () => {
    try {
      const remainingCoins = await fetchRemainingRequests(userEmail, isLoggedIn)
      setCoins(remainingCoins)
    } catch (error) {
      console.error('Error updating coins:', error)
      setCoins(0)
    }
  }

  // Обновляем монеты при изменении состояния пользователя
  useEffect(() => {
    updateCoins()
  }, [isLoggedIn, userEmail]) // Зависимости: при изменении isLoggedIn или userEmail

  // Обработчики событий
  const handleEmailChange = (e) => setEmail(e.target.value)
  const handlePasswordChange = (e) => setPassword(e.target.value)

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      setAuthError('Registration was successful!')
      setModalType(null)
      // Обновляем состояние после успешной регистрации
      setIsLoggedIn(true)
      setUserEmail(userCredential.user.email)
      await updateCoins()
    } catch (error) {
      setAuthError(`Registration error: ${error.message}`)
    }
  }

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      setAuthError('')
      setModalType(null)
      // Обновляем состояние
      setIsLoggedIn(true)
      setUserEmail(userCredential.user.email)
      await updateCoins()
    } catch (error) {
      setAuthError(`Login error: ${error.message}`)
    }
  }

  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setAuthError('Password recovery email sent!')
        setModalType(null)
      })
      .catch((error) => setAuthError(`Error sending email: ${error.message}`))
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setIsLoggedIn(false)
      setUserEmail('')
      await updateCoins()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const closeModal = () => {
    setModalType(null)
    setEmail('')
    setPassword('')
    setAuthError('')
  }

  // Слушаем изменения состояния аутентификации
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true)
        setUserEmail(user.email)
      } else {
        setIsLoggedIn(false)
        setUserEmail('')
      }
    })
    return () => unsubscribe()
  }, [])

  return (
    <div className='appWrapper'>
      <header className='header'>
        <div className='coinsContainer'>
          <img src={coin} alt='coins' />
          <div>
            <Coins coins={coins} />
          </div>
        </div>
        <div className='authButtons'>
          {isLoggedIn ? (
            <>
              <span className='userLoginEmail'>{userEmail}</span>
              <button onClick={handleLogout} className='signOutButton'>
                Sign out
              </button>
            </>
          ) : (
            <>
              <button
                className='loginButton'
                onClick={() => setModalType('login')}
              >
                Sign In
              </button>
              <button
                className='registerButton'
                onClick={() => setModalType('register')}
              >
                Register
              </button>
            </>
          )}
        </div>
      </header>
      <h1>AI Homework</h1>
      <h3>
        write, tell or take a photo of your homework and get a solution from AI
      </h3>
      <MainForm
        email={userEmail}
        coins={coins}
        setCoins={setCoins}
        fetchRemainingRequests={updateCoins}
        isLoggedIn={isLoggedIn}
      />
      <div className='authModalContent'>
        <Modal isOpen={!!modalType} closeModal={closeModal}>
          {modalType === 'login' && (
            <LoginForm
              email={email}
              password={password}
              onEmailChange={handleEmailChange}
              onPasswordChange={handlePasswordChange}
              onLogin={handleLogin}
              authError={authError}
              onReset={() => setModalType('reset')}
            />
          )}
          {modalType === 'register' && (
            <RegisterForm
              email={email}
              password={password}
              onEmailChange={handleEmailChange}
              onPasswordChange={handlePasswordChange}
              onRegister={handleRegister}
              authError={authError}
            />
          )}
          {modalType === 'reset' && (
            <ResetForm
              email={email}
              onEmailChange={handleEmailChange}
              onReset={handlePasswordReset}
              authError={authError}
            />
          )}
        </Modal>
      </div>
    </div>
  )
}

export default AuthComponent
