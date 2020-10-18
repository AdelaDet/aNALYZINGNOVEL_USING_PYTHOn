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
      