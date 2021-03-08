import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from "styled-components"




const Resource = (props) => {
  const {url, name} = props
  return(
    <div>
      <p>this link takes you to an outside resource</p>
      <a href={url}>{name}</a>
      <p>happy learning!</p>
      </div>
  )
}

export default (Resource)
