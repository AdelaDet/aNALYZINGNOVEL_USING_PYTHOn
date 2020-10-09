import React from 'react'
import  Grid from '@material-ui/core/Grid'
import {PathCard} from '../paths'

const styles = {
  container: {
    padding: '0 20px',
    textAlign: 'center',
    marginTop: 50
  },
  header: {
    textAlign: 'center',
    fontWeight: 300,
    fontSize: 28
  },
  subheader: {
    textAlign: 'center',
    paddingBottom: 40
  }
}

const CategoryAllPaths = (props) => {
  const {paths, categoryName} = props
  const pathsCount = paths.length
  return(
    <div style={styles.container}>
      <h2 style={styles.header}>{`All ${categoryName} Learning Paths`}</h2>
      <h3 style={styles.subheader}>
        {`There ${pathsCount < 2 ? 'is' : 'are'} ${pathsCount} learning ${pathsCount < 2 ? 'path' : 'paths'} available`}
      </h3>
      <Grid container spacing={24} direction="row">
        <Grid container item spacing={24} justify="center" >
        {paths.map((path) =>
          <Grid item lg={3} key={path.name}>
            <PathCard
              reviewCount={path.reviewCount || null}
              userCount={path.userCount || null}
              name={path.name}
              owner={path.owner}
              rating={path.rating || 0}
              uid={path.uid}
              slug={path.slug}
              category={categoryName}
            />
          </Grid>
        )}
        </Grid>
      </Grid>
    </div>
  )
}

export default CategoryAllPaths
