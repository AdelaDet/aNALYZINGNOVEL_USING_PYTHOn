import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

const About = () => {

  const styles = {
    container: {
      paddingLeft: 200,
      paddingRight: 200,
      paddingTop: 50
    },
    header: {
      marginBottom: 40
    },
    content: {
      lineheight: 2
    }
  }

  return (
    <div style={styles.container}>

      <Typography
        variant="display1"
        align="center"
        style={styles.header}