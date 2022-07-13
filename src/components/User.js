import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { useAuth } from '../AuthContext';
import { doc, where, query, orderBy, collection, getDocs, onSnapshot, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase/config';
import Header from './Header';
import Tweets from './Tweets';
import '../css/Profile.css'

export default function User() {
  const { currentUser } = useAuth()
  let { userID } = useParams()
  let userRef = doc(db, "users", userID)
  const [user, setUser] = useState()
  let userInfo;
  const tweetsRef = collection(db, "messages")
  const q = query(tweetsRef, where("userID", "==", userID), orderBy("time", "desc"));
  const [tweet, setTweet] = useState([])

  useEffect(() => {
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

    onSnapshot(userRef, (doc) => {
      setUser(doc.data())
    })
  }, [])

  function handleFollow(id, followers) {
    if (followers.includes(currentUser.uid)) {
      const x = window.confirm("Unfollow this person?")
      if (x === true) {
        updateDoc(doc(db, "users", id), {
          followers: arrayRemove(currentUser.uid)
        })
        updateDoc(doc(db, "users", currentUser.uid), {
          following: arrayRemove(id)
        })
      }
    } else {
      updateDoc(doc(db, "users", id), {
        followers: arrayUnion(currentUser.uid)
      })
      updateDoc(doc(db, "users", currentUser.uid), {
        following: arrayUnion(id)
      })
    }
  }

  function checkFollows(followers) {
    let status = ""
    if (followers.includes(currentUser.uid)) {
      status = "Followed"
    } else {
      status = "Follow"
    }
    return {
      status: status,
      count: followers.length - 1
    }
  }

  function hidden(uid) {
    if (currentUser.uid === uid) {
      return "hidden"
    } else {
      return 
    }
  }

  function btnHidden(status) {
    if (status === "followed") {
      return "hidden"
    } else {
      return
    }
  }

  if (user !== undefined) {
    userInfo = (
      <>
        <div id='profile-info'>
          <span><img src={user.photoURL} id='avatar-large' alt='Profile photo' /></span>
          <div>
            <h2>{user.displayName}</h2>
            <p>Joined: {user.date_joined}</p>
            <p>Followers: {checkFollows(user.followers).count}</p>
          </div>
          <button id='follow-btn' className={hidden(user.id) + " btn " + checkFollows(user.followers).status} onClick={(e) => {
            e.preventDefault();
            handleFollow(user.id, user.followers)
            }}>
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className={"bi bi-plus-lg"} viewBox="0 0 16 16"> <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" fill="white"></path></svg>{checkFollows(user.followers).status}
              </span>
          </button>
        </div>
        <div id='user-tweets'>
          <Tweets list={tweet} />
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className='Profile'>
        {userInfo}
      </div>
    </>
  )
}
