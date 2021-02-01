import React from 'react'

import { TextValidator } from 'react-material-ui-form-validator'

const BuilderDescription = ({description}) => {
  return (
    <TextValidator
      multiline={true}
      id="path-description"
      label="Give your path a short description"
      name="description"
      value={description}
      placeholder="ie. A learning path to get started using the d3.js data visualization library"
      fullWidth
      mar