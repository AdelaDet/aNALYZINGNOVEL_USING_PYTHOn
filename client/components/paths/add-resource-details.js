import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addStepToPathThunk, getSinglePathByUidThunk } from '../../store'

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import Button from '@material-ui/core/Button'

const styles = {
  button: {
    marginTop: 30
  }
}

class AddResourceDetails extends Component {

  constructor(){
    super()
    this.state = {
      title: '',
      description: '',
      imageUrl: '',
      type1: ''
    }
  }

  componentWillMount = () => {
    this.setState({
      title: this.props.resource[0].name