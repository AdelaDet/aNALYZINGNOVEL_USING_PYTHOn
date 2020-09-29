
import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {auth, newUserThunk, getSingleUserPathsThunk} from '../store'
import history from '../history'
import {withStyles} from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'

/**
 * COMPONENT
 */

const styles = {
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
    marginTop: 10
  }
}

const AuthForm = props => {
  const {name, displayName, handleSubmit, error, handleNewuser, classes} = props

  return (
    <Grid container spacing={24} direction="row">
      <Grid container item spacing={24} justify="center" >
      <Grid item xs={4} >
        <form
          onSubmit={displayName === 'Sign Up' ? handleNewuser : handleSubmit}
          name={name}
          className={classes.container}
        >
          <FormControl fullWidth>
            <InputLabel htmlFor="adornment-amount">Username</InputLabel>
            <Input
              id="username"
              name="username"
              label="Username"
              required={true}
            />
          </FormControl>
          {displayName === 'Sign Up' && (
            <FormControl fullWidth>
              <InputLabel htmlFor="adornment-amount">Email</InputLabel>
              <Input id="email" name="email" label="Email" required={true} />
            </FormControl>
          )}
            <FormControl fullWidth>
              <InputLabel htmlFor="adornment-amount">Password</InputLabel>
              <Input
                id="password"
                name="password"
                label="Password"
                required={true}
                inputProps={{
                  type: 'password'
                }}
              />
            </FormControl>
          <div>
            <Button
              type="submit"
              size="large"
              className={classes.button}
              variant="outlined"
            >
              {displayName}
            </Button>
          </div>
          {error && error.response && <div> {error.response.data} </div>}
        </form>

          {/* <a href="/auth/google">{displayName} with Google coming soon</a> */}

        </Grid>
      </Grid>
    </Grid>
  )
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error
  }
}

const mapSignup = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error
  }
}

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const name = evt.target.username.value
      const password = evt.target.password.value
      dispatch(auth(name, password, formName))
      //get user paths so that we know which public paths
      //to display as follow and which to display as unfollow
      dispatch(getSingleUserPathsThunk(name))

    },
    handleNewuser(evt) {
      evt.preventDefault()
      const name = evt.target.username.value
      const email = evt.target.email.value
      const password = evt.target.password.value
      dispatch(newUserThunk(name, email, password))
      history.push('/user/dashboard')
    }
  }
}

export const Login = connect(mapLogin, mapDispatch)(
  withStyles(styles)(AuthForm)
)
export const Signup = connect(mapSignup, mapDispatch)(
  withStyles(styles)(AuthForm)
)
/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}