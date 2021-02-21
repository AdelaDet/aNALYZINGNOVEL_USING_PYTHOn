import React from 'react'

import { TextValidator } from 'react-material-ui-form-validator'

const BuilderTags = ({tags}) => {
  return (
    <TextValidator
      id="path-tags"
      label="Give your path some tags"
      name="tags"
      value={tags}
      placeholder="ie. data, d3, react"
      fullWidth
      margin="normal"
      required={true}
      validators={['required']}
      errorMessages={['Please tag your path']}
    />
  )
}

export default BuilderTags

