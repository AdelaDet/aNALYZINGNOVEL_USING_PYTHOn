import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch, Redirect} from 'react-router-dom'
import PropTypes from 'prop-types'
import {Login, Signup, UserHome, UserDashboard, CategorySinglePage, HomePage, About, Resource} from './components'
import {PublicSinglePath,DraggableListContainer } from './components/paths'
import {me} from './store'



class Routes extends Component {
  componentDidMount() {
    this.props.loadIni