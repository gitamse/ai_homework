import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBNNF31r9zMP8kmnz32xZ3uj2_uXJlrsyA',
  authDomain: 'ai-homework-b595a.firebaseapp.com',
  projectId: 'ai-homework-b595a',
  storageBucket: 'ai-homework-b595a.appspot.com',
  messagingSenderId: '721318653829',
  appId: '1:721318653829:web:1cefacca16c11fa05f1eec',
  measurementId: 'G-GQ8GCHXKMT',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export default app
