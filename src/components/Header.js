import React, { useEffect } from 'react'
import Logo from '../media/favicon.png'
import { db } from '../firebase/config';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { getDoc, setDoc, doc } from 'firebase/firestore';

export default function Header() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const userRef = doc(db, "users", currentUser.uid)

  useEffect(() => {
    getDoc(userRef)
      .then((doc) => {
        if (doc.data() === undefined) {
          setDoc(userRef, {
            id: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            email: currentUser.email,
            followers: ["default"],
            following: ["default"],
            date_joined: new Intl.DateTimeFormat('en-US',{month:'short', day:'numeric', year:'numeric'}).format(new Date())
          })
        } else {}
      })
  })

  async function handleLogout() {
    let result = window.confirm("Are you sure you want to log out?");
    if (result) {
      try {
        await logout();
        navigate("/login")
      } catch (error) {
        console.log("Failed")
      }
    } else {}
  }

  return (
    <div id='header'>
      <span className='left-col' onClick={(e) => {
        e.preventDefault();
        navigate('/feed')
        }}>
        <img src={Logo} id='logo' alt='Logo' />
        <span>Tweeter</span>
      </span>
      <img src={currentUser.photoURL} id='profile-pic' className='avatar' onClick={(e) => {
        e.preventDefault();
        navigate('/@' + currentUser.uid)
      }} />
      <button className='btn' onClick={(e) => {
        e.preventDefault();
        handleLogout();
      }}>Log Out</button>
    </div>
  )
}
