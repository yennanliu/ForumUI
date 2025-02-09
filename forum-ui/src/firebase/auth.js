import { auth } from './config'
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  TwitterAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signOut
} from 'firebase/auth'

// Create providers
const googleProvider = new GoogleAuthProvider()
const githubProvider = new GithubAuthProvider()
const twitterProvider = new TwitterAuthProvider()
const facebookProvider = new FacebookAuthProvider()

// Social sign in functions
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider)
export const signInWithGithub = () => signInWithPopup(auth, githubProvider)
export const signInWithTwitter = () => signInWithPopup(auth, twitterProvider)
export const signInWithFacebook = () => signInWithPopup(auth, facebookProvider)

// Sign out
export const signOutUser = () => signOut(auth)

// Get current user
export const getCurrentUser = () => auth.currentUser 