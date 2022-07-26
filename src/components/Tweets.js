import React from 'react'
import { db } from '../firebase/config'
import { doc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { useAuth } from '../AuthContext'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Footer from './Footer'
import Trash from '../media/trash.png'

export default function Tweets(props) {
  const { currentUser } = useAuth();
  const list = props.list;

  function handleDelete(id) {
    deleteDoc(doc(db, "messages", id))
  }

  function hidden(uid) {
    if (currentUser.uid === uid) {
      return
    } else {
      return "hidden"
    }
  }

  function handleLike(id, likes) {
    if (likes.includes(currentUser.uid)) {
      updateDoc(doc(db, "messages", id), {
        likes: arrayRemove(currentUser.uid)
      })
    } else {
      updateDoc(doc(db, "messages", id), {
        likes: arrayUnion(currentUser.uid)
      })
    }
  }

  function liked(id, likes) {
    if (likes.includes(currentUser.uid)) {
      return (
        <svg onClick={(e) => {
          e.preventDefault();
          handleLike(id, likes)
        }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart-fill" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" fill="#d00404"></path></svg>
      )
    } else {
      return (
        <svg onClick={(e) => {
          e.preventDefault();
          handleLike(id, likes)
        }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16"> <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/></svg>
      )
    }
  }

  return (
    <>
      {list.map((tweet) => 
        <div className='tweet' key={list.indexOf(tweet)}>
          <div className='tweet-left-col'>
            <img src={tweet.photoURL} className='avatar' />
          </div>
          <div className='tweet-right-col'>
            <div className='tweet-info'><Link to={'/@' + tweet.userID}><b>{tweet.username}</b></Link> &#183; {moment(tweet.time).fromNow()}</div>
            <div>{tweet.text}</div>
            <div id='interactive-row'>
              <span id='likes-container'>
                {liked(tweet.id, tweet.likes)}
                <span className='likes-counter'>{tweet.likes.length}</span>
              </span>
            </div>
            <div className='dropdown'>
              <img src={Trash} className={hidden(tweet.userID) + ' trash'} onClick={(e) => {
                e.preventDefault();
                const x = window.confirm('Delete tweet: "' + tweet.text + '?')
                if (x === true) {
                  handleDelete(tweet.id)
                } else {}
              }} />
            </div>
          </div>
        </div>)}
    </>
  )
}
