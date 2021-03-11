import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch, Redirect} from 'react-router-dom'
import PropTypes from 'prop-types'
import {Login, Signup, UserHome, UserDashboard, CategorySinglePage, HomePage, About, Resource} from './components'
import {PublicSinglePath,DraggableListContainer } from './components/paths'
import {me} from './store'



class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {
    const {isLoggedIn} = this.props

    return (
      <Switch>
        {/* Routes placed here are available to all visitors */}
        <Route exact path="/" component={HomePage} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        {/* <Route path="/resource/:resourceUid" component={Resource} /> */}
        <Route exact path="/category/:categoryName" component={Categor