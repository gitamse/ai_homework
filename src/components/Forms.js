import React from 'react'
import './Forms.css'

export const LoginForm = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onLogin,
  onReset,
  authError,
}) => (
  <>
    <h2>Sign In</h2>

    <input
      type='email'
      value={email}
      onChange={onEmailChange}
      placeholder='Email'
    />
    <input
      type='password'
      value={password}
      onChange={onPasswordChange}
      placeholder='Password'
    />
    <div className='authError'>{authError}</div>
    <div className='loginModalButtons'>
      <button onClick={onLogin} className='submitModalButton'>
        Sign In
      </button>
      <button onClick={onReset} className='restorePasswordButton'>
        Forgot Password
      </button>
    </div>
  </>
)

export const RegisterForm = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onRegister,
  authError,
}) => (
  <>
    <h2>Registration</h2>
    <input
      type='email'
      value={email}
      onChange={onEmailChange}
      placeholder='Email'
    />
    <input
      type='password'
      value={password}
      onChange={onPasswordChange}
      placeholder='Password'
    />
    <div className='authError'>{authError}</div>
    <div className='loginModalButtons'>
      <button onClick={onRegister} className='submitModalButton'>
        Register
      </button>
    </div>
  </>
)

export const ResetForm = ({ email, onEmailChange, onReset, authError }) => (
  <>
    <h2>Restore Password</h2>
    <input
      type='email'
      value={email}
      onChange={onEmailChange}
      placeholder='Enter Your Email'
    />
    <div className='authError'>{authError}</div>
    <div className='loginModalButtons'>
      <button onClick={onReset} className='submitModalButton'>
        Send
      </button>
    </div>
  </>
)
