
import React from 'react'
import CallToAction from './home/call-to-action'
import InfoBlock from './home/info-block'
import HomeStepper from './home/home-stepper'
import SearchAny from './search-bar-any'
import PopularCategories from './category/popular-category'
import PopularPaths from './paths/popular-paths'

import Grid from '@material-ui/core/Grid'

const styles = {
  callToActionTop: {
    margin: '100px 0'
  },
  stepper: {
    marginTop: '100px',
    marginBottom: '50px'
  },
  categories: {
    marginTop: '100px'
  },
  block: {
    marginTop: '100px'
  }
}

const HomePage = () => {
  return (
    <div>
      <div id="home-fold">
        <Grid container spacing={40} id="home-fold">
          <Grid item lg={12}>
            <div style={styles.callToActionTop}>
              <CallToAction text="Code Map makes it easy for you to reach your code learning goals" />
            </div>
          </Grid>
        </Grid>

      </div>

      <Grid container spacing={40}>
        <Grid item lg={12}>
          <div style={styles.stepper}>
            <HomeStepper />
          </div>
        </Grid>
      </Grid>

      <Grid container spacing={40}>
        <Grid item lg={12}>
          <CallToAction text="Ready to get started?" />
          <SearchAny placeholder="What do you want to learn..." />
        </Grid>
      </Grid>

      <Grid container spacing={40}>
        <Grid item lg={12}>
          <div style={styles.categories}>
          <PopularCategories />
          </div>
        </Grid>
      </Grid>

      <Grid container spacing={40}>
        <Grid item lg={12}>
          <div style={styles.popularPaths}>
            <PopularPaths />
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default HomePage