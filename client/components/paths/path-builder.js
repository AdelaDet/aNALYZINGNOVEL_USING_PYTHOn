
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { ValidatorForm } from 'react-material-ui-form-validator'

import { addNewPathThunk } from '../../store'

import BuilderTitle from './builder-title'
import BuilderDescription from './builder-description'
import BuilderCategory from './builder-category'
import BuilderTags from './builder-tags'
import BuilderLevel from './builder-level'

import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: 'white',
    borderWidth: '1px',
    borderColor: '#efefef',
    borderStyle: 'solid',
    padding: '40px',
    paddingTop: '20px'
  },
  button: {
    marginTop: 30
  }
})

class PathBuilder extends Component {

  constructor(){
    super()
    this.state = {
      name: '',
      description: '',
      language: 'Javascript',
      tags: '',
      level: 'beginner',
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()

    const username = this.props.user
    this.props.addNewPath({...this.state, user: username})

    this.setState({
      name: '',
      description: '',
      language: '',
      tags: '',
      level: '',
      category: ''
    })
  }

  render(){
    const { classes } = this.props
    return (
      <div style={{maxWidth: 700}}>
        <h3>Add New Learning Path: {this.state.name}</h3>
          <ValidatorForm
            className={classes.container}
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
            noValidate autoComplete="off"
          >

            <BuilderTitle name={this.state.name} />

            <BuilderDescription description={this.state.description} />

            <BuilderCategory category={this.state.language} />

            <BuilderTags tags={this.state.tags} />

            <BuilderLevel level={this.state.level} />

            <Button
              type="submit"
              size="large"
              className={classes.button}
              variant="outlined">
              Build Your Path
            </Button>

          </ ValidatorForm>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addNewPath: (path) => {
      dispatch(addNewPathThunk(path))
    }
  }
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(PathBuilder))