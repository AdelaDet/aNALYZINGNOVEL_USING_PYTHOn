
import React, {Component} from 'react'

import { TextValidator } from 'react-material-ui-form-validator'

class BuilderTitle extends Component {
  render(){
    const { name } = this.props
    return (
      <TextValidator
        onChange={this.handleChange}
        id="path-title"
        label="What is the title of your path?"
        name="name"
        value={name}
        placeholder="ie. Foundations of d3.js"
        fullWidth
        margin="normal"
        required={true}
        validators={['required']}