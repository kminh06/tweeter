import React, { useEffect, useState } from 'react'
import Feed from './Feed'
import { useAuth } from '../AuthContext';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function Home(props) {
  const { currentUser } = useAuth()
  const [user, setUser] = useState()

  useEffect(() => {
    onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
      setUser(doc.data())
    })
  }, [])

  return (
    <Feed query={props.query} user={user} />
  )
}
