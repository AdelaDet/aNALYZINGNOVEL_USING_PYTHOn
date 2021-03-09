import React, {Component} from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import styled from "styled-components"

import { createFuzzyMatchThunk, createMatchAllInCategoryThunk } from '../store'

const DropDown = styled.div`
  position: absolute;
  z-index: 0;
  background-color: white;
  padding-left: 40px;
  max-height:200px;
  overflow: scroll;
  width: 600px;
`

const MatchRow = styled.div`
  height: auto;
  width: autl;
  padding-left: 4px;
  padding-right: 4px;
  border-radius: 6px;
  margin: 0;
  &:hover {
    background-color: #efe6f2;
  }
`

class SearchAn