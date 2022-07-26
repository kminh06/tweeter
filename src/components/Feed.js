import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import Header from './Header'
import { db } from '../firebase/config'
import { onSnapshot, query, orderBy, limit, collection, addDoc, getDocs, QuerySnapshot, where, doc, getDoc } from 'firebase/firestore'
import '../css/Feed.css'
import Tweets from './Tweets'
import { Route, Routes, useNavigate } from 'react-router-dom';
import Footer from './Footer';

export default function Feed(props) {
  const { currentUser } = useAuth()
  const [text, updateText] = useState('')
  const [tweet, setTweet] = useState([])
  const user = props.user
  const tweetsRef = collection(db, "messages")
  let q = query(tweetsRef, orderBy("time", "desc"));
  const userRef = doc(db, "users", currentUser.uid)
  const [filter, setFilter] = useState()
  const navigate = useNavigate()

  useEffect(() => {
    if (user !== undefined) {
      if (props.query === "all") {
        q = query(tweetsRef, orderBy("time", "desc"))
      } else {
        q = query(tweetsRef, where("userID", "in", user.following), orderBy("time", "desc"))
      }
    }
    
    setFilter(props.query)
    
    onSnapshot(q, (QuerySnapshot) => {
      let list = []
      getDocs(q)
        .then((snapshot) => {
          snapshot.docs.forEach((doc) => {
            list.push({
              text: doc.data().text,
              photoURL: doc.data().photoURL,
              username: doc.data().username,
              userID: doc.data().userID,
              likes: doc.data().likes,
              time: doc.data().time,
              id: doc.id
            })
          })
          setTweet(list);
        })
    })
  }, [props.query])

  function handleChange(e) {
    updateText(e.target.value)
  }

  function handleTweet() {
    if (text === '') {
      return;
    }

    addDoc(tweetsRef, {
      text: text, 
      userID: currentUser.uid, 
      username: currentUser.displayName, 
      photoURL: currentUser.photoURL,
      likes: [], 
      time: Date.now()
    })

    updateText('')
  }

  function handleFilter(x) {
    if (x === filter) {
      return "active"
    } else {
      return ""
    }
  }

  return (
    <>
      <Header />
      <div className='Feed'>
        <form id='tweet-box'>
          <textarea id='tweet-input' onChange={handleChange} value={text} maxLength="140" placeholder='Say something ...' />
          <div>
            <span>{140 - text.length} characters left</span>
            <button className='btn' id='tweet-btn' onClick={(e) => {
              e.preventDefault();
              handleTweet()
            }}>Tweet</button>
          </div>
        </form>
        <div id='feed-filter'>
          <button className={'btn filter ' + handleFilter("all")} onClick={(e) => {
            e.preventDefault();
            navigate('/feed')
          }}>All</button>
          <button className={'btn filter ' + handleFilter("following")} onClick={(e) => {
            e.preventDefault();
            navigate('/feed/following')
          }}>Following</button>
        </div>
        <div id='tweets-container'>
          <Tweets list={tweet} />
        </div>
      </div>
      <Footer />
    </>
  )
}
