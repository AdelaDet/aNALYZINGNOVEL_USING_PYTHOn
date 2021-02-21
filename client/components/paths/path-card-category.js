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
padding: