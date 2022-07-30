import React from 'react'
import Github from '../media/github.png'

export default function Footer(props) {
  return (
    <div id='footer' className={props.class}>
      <p>2022 &copy; Khac Minh Dau</p>
      <a target='_blank' href='https://github.com/kminh06'><img src={Github} id='github' /></a>
    </div>
  )
}
