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
      title: this.props.resource[0].name,
      description: this.props.resource[0].description,
      imageUrl: this.props.resource[0].imageUrl,
      type1: this.props.resource[0].type
    })
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const { username, pathUid, url } = this.props
    this.props.addStepToPath(username, pathUid, url, {...this.state}, 'new')

    this.setState({
   