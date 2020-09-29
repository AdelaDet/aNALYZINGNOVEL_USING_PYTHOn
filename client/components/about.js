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
        style={styles.header}>
        About Code Map
      </Typography>

      <Grid container spacing={40}>
        <Grid item xs={12}>
          <p>Code Map solves the problem of having hundreds (maybe thousands!) of free online coding tutorials, articles, and projects at your finger tips but no good way to keep track of what you've finished, how you're progressing, or which one you'd like to do next.</p>
          <p>With Code Map you can build your own personalized learning path with the content you want to learn, or, subscribe to another user's path and starting tracking your progress right away.</p>
          <p>Get started by checking out the language categories or searching the site for coding subjects you're interested in learning.</p>
        </Grid>
      </Grid>

    </div>
  )
}

export default About
