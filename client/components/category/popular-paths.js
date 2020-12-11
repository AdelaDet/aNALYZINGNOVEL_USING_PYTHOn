
import React from 'react'
import { connect } from 'react-redux'
import { getPopularPathsInCategory } from '../../store'
import { PathCard } from '../paths'
import Grid from '@material-ui/core/Grid'

const styles = {
  container: {
    padding: 20,
    marginTop: 50
  },
  header: {
    textAlign: 'center',
    fontWeight: 300,
    paddingBottom: 40,
    fontSize: 28
  }
}

class CategoryPopularPaths extends React.Component {
  componentDidMount(){
    const categoryName = this.props.categoryName
    this.props.getPopularCategoryPaths(categoryName)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.categoryName !== this.props.categoryName) {
      const categoryName = nextProps.categoryName
      this.props.getPopularCategoryPaths(categoryName)
    }
  }

  render() {
    const { categoryName } = this.props
    const popularPathsInCategory = this.props.popularPathsInCategory
    return (
      <div style={styles.container} >
        <h2 style={styles.header}>{`Popular ${categoryName} Learning Paths`}</h2>
        <Grid container spacing={24} direction="row">
        <Grid container item spacing={24} justify="center" >
          {popularPathsInCategory.map((path) =>
            <Grid item xs={3} key={path.uid} >
              <PathCard
                popular={true}
                name={path.name}
                owner={path.owner}
                rating={path.rating}
                slug={path.slug}
                category={path.category}
                userCount={path.userCount}
                uid={path.uid}
              />
            </Grid>
          )}
        </Grid>
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return({
    popularPathsInCategory: state.pathReducer.popularPathsInCategory
  })
}

const mapDispatchToProps = (dispatch) => {
  return({
    getPopularCategoryPaths : (categoryName) => {
      return dispatch(getPopularPathsInCategory(categoryName))
    }
  })
}


export default connect(mapStateToProps, mapDispatchToProps)(CategoryPopularPaths)