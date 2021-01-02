import React from 'react'
import { Link } from 'react-router-dom'

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

const styles = {
  container: {
    marginBottom: 20
  }
}

class NavDashboard extends React.Component {

  constructor(){
    super()
    this.stat