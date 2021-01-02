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
    this.state = {
      value: 'my-paths'
    }
  }

  componentDidMount(){
    this.setState({
      value: this.props.view
    })
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  render() {
    return (
      <Grid
        style={styles.container}
        container spacing={24}
        direction="column"
        align="center">

        <Grid item xs={6}>
          <Paper>
            <Tabs
              value={this.state.value}
              indicatorColor="primary"
        