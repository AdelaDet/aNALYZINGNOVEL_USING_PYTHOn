
import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'

import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import CategoryDropdown from './category/category-dropdown'

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  logo: {
    float: 'left',
    marginRight: 20,
    fontSize: 32,
    title: {
      float: 'left',
      fontWeight: 300,
      position: 'relative',
      top: 5
    }
  }
}

const MainNav = ({handleClick, isLoggedIn, classes}) => (
  <div className={classes.root}>
    <AppBar position="static" color="default">
      <Toolbar>

      <div className={classes.flex}>
          <Link to="/">
            <div>
              <i style={styles.logo} className="material-icons">explore</i>
              <Typography style={styles.logo.title} variant="title" color="inherit">Code Map</Typography>
            </div>
          </Link>
      </div>

        <div>
          <CategoryDropdown />
        </div>

        <Link to="/about">
          <Button color="inherit">About</Button>
        </Link>

        {isLoggedIn ? (
          <div>
            {/* The navbar will show these links after you log in */}
            <Link to="/user/dashboard">
              <Button color="inherit">Dashboard</Button>
            </Link>
            <Button onClick={handleClick}>
              Logout
            </Button>
          </div>
        ) : (
          <div>
            {/* The navbar will show these links before you log in */}
            <Link to="/login">
              <Button color="inherit">Login</Button>
            </Link>
            <Link to="/signup">
              <Button color="inherit">Sign up</Button>
            </Link>
          </div>
        )}
      </Toolbar>
    </AppBar>
  </div>
)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.name
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(withStyles(styles)(MainNav))

/**
 * PROP TYPES
 */
MainNav.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}