import React, { useEffect } from 'react';
import { GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../css/Login.css'
import Fb from '../media/facebook.png'
import Logo from '../media/favicon.png'
import Footer from './Footer';

export default function Login() {
  const { login } = useAuth();
  const googleProvider = new GoogleAuthProvider();
  const fbProvider = new FacebookAuthProvider();

  return (
    <div className='Login'>
      <div id='header'>
        <span className='left-col'>
          <img src={Logo} id='logo' />
          <span>Tweeter</span>
        </span>
      </div>
      <h1 id='title'>Log In</h1>
      <button className='loginBtn google' onClick={(e) => {
        e.preventDefault();
        login(googleProvider)
      }}>{<img src='https://img.icons8.com/color/100/000000/google-logo.png'></img>}<span>Login with Google</span></button>
      <button className='loginBtn facebook' onClick={(e) => {
        e.preventDefault();
        login(fbProvider)
      }}>{<img src={Fb}></img>}<span>Login with Facebook</span></button>
      <Footer />
    </div>
  )
}