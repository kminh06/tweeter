import '../css/App.css';
import React from 'react';
import Login from './Login';
import User from './User';
import Home from './Home';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function App() {
  const { currentUser } = useAuth()

  return (
    <div className='App'>
      <Routes>
        <Route exact path="/" element={<Navigate to='/feed' />} />
        <Route exact path="/feed" element={(currentUser) ? <Home query='all' /> : <Navigate to='/login' />} />
        <Route path="/feed/following" element={(currentUser) ? <Home query='following' /> : <Navigate to='/login' />} />
        <Route path="/login" element={(!currentUser) ? <Login /> : <Navigate to='/feed' />} />
        <Route path = "/@:userID" element={(currentUser) ? <User /> : <Navigate to='/login' />} />
      </Routes>
    </div>
  ) 
}