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

class SearchAny extends Component {
  constructor(props) {
    super(props)
    this.state = {
      input: ''
    }
  }

  handleChange = async (event) => {
      await this.setState({
        input: event.target.value
      })
      //if you have your routes set up correctly, this clause should make it so
      //that you don't have to pass in any additional props
        if(this.props.match.params.categoryName){
          this.props.fuzzyMatchByCategory(this.state.input