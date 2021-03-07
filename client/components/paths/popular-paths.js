
import React from 'react'
import { connect } from 'react-redux'
import { getPopularPathsInAllCategories } from '../../store'
import { PathCard } from './index'
import Grid from '@material-ui/core/Grid'

const styles = {
  container: {
    padding: '0 20px',
    textAlign: 'center',
  },
  header: {
    textAlign: 'center',
    fontWeight: 300,
    paddingBottom: 40,
    fontSize: 36
  }
}

class PopularPaths extends React.Component {

  componentDidMount(){
    this.props.getPopularPaths()
  }

  render() {
    const popularPaths = this.props.popularPaths
    return(
      <div style={styles.container}>
        <h2 style={styles.header}>Popular Learning Paths</h2>
        <Grid container spacing={40}>
        {
          (popularPaths)
          ? popularPaths.map(path =>
              <Grid item lg={3} key={path.name}>
                <PathCard
                  reviewCount={path.reviewCount.low}
                  userCount={path.userCount.low}
                  name={path.name}
                  owner={path.owner}
                  rating={path.rating}
                  uid={path.uid}
                  slug={path.slug}
                  category={path.category}
                />
              </Grid>
            )
          : <p> no paths found </p>
        }
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return({
    popularPaths : state.pathReducer.popularPathsInAllCategories,
  })
}

const mapDispatchToProps = (dispatch) => {
  return({
    getPopularPaths : () => dispatch(getPopularPathsInAllCategories()),
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(PopularPaths)