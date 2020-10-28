import React, { Component } from 'react'
import {Link, NavLink} from 'react-router-dom'
import { connect } from 'react-redux'
import { getAllParentCategoriesThunk } from '../../store'

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';

class CategoryDropdown extends Component {
  state = {
    anchorEl: null,
  }

  componentDidMount = () => {
    this.props.getParentCategories()
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render(){
    const { anchorEl } = this.state
    const {parentCategories} = this.props

    return (
      <div>
        <Button
          aria-owns={anchorEl ? 'fade-menu' : null}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          Categories
        </Button>
        <Menu
          id="fade-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          TransitionComponent={Fade}
        >
        {
          parentCategories.map((name) => {
            return (
              <MenuItem
                key={name}
                component={NavLink}
                to={`/category/${name}`}
                onClick={this.handleClose}>
                {name}
              </MenuItem>
            )
          })
        }
        </Menu>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    parentCategories: state.category.allParentCategories
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getParentCategories: () => {
      dispatch(getAllParentCategoriesThunk())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryDropdown)
