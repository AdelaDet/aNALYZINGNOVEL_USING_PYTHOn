import React from 'react'
import { Redirect } from 'react-router'
import {Link} from 'react-router-dom'
import styled from "styled-components"
import {Stars} from '../reviews'

const Card = styled.div`
margin: 20px;
width: 400px;
height: 150px;
box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
display: flex;
padding: 0;
overflow:auto;
background-color: white;
justify-content: flex-start
`

const CardContent = styled.div`
  padding: 10px;
  box-sizing: border-box;
  font-weight: 200;
  line-height: normal;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-top: 10px;
`

const PathCardSmallCategory = (props) => {
   const {img, name, rating, description, uid, slug} = props
   const url = props.url || 'home'
    return(
      <div>
        <Link to={`/paths/${uid}/${slug}`}>
          <Card >
            <img src={img} style={{height:150}}/>
            <CardContent>
              <h4 style={{margin:0}}>{name}</h4>
              <p style={{margin:0}}>{description}</p>
              <Stars value={rating} />
            </CardContent>
          </Card>
        </Link>
      </div>
    )}


export default PathCardSmallCategory
