
import React, { Component } from 'react'
import { CategoryAllPaths, CategoryPopularPaths } from './'
import { connect } from 'react-redux'
import { getAllPathsInCategory } from '../../store'
import Grid from '@material-ui/core/Grid';
import { SearchAny } from '../'

const styles = {
  loader: {
    paddingTop: 100,
    textAlign: 'center',
    header: {
      textAlign: 'center',
      fontWeight: 300,
      fontSize: 24
    }
  },
  header: {
    textAlign: 'center',
    fontWeight: 300,
    fontSize: 36
  },
  image: {
    textAlign: 'center',
    marginTop: 40
  }
}

class CategorySinglePage extends Component {

  componentDidMount() {
    const {categoryName} = this.props.match.params
    this.props.getAllCategoryPaths(categoryName)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params !== this.props.match.params) {
      const {categoryName} = nextProps.match.params
      this.props.getAllCategoryPaths(categoryName)
    }
  }

  createImageSlug = (str) => {
    return str.toLowerCase().replace(/\s/g, '')
  }

  render() {
    const paths = this.props.pathsInCategory
    const {categoryName} = this.props.match.params
    const imageSlug = this.createImageSlug(categoryName)

    if(paths.length === 0){
      return (
        <div style={styles.loader}>
          <h2 style={styles.loader.header}>Loading...</h2>
        </div>
      )
    }

    return (
      <Grid container>
        <Grid item lg={12}>
          <div style={styles.image}>
            <img src={`/category-logos/${imageSlug}.png`} width={75} />
          </div>
          <h2 style={styles.header}>Category: {categoryName}</h2>
        </Grid>

        <Grid item lg={12}>
          <SearchAny category={categoryName} placeholder={`Search paths in the ${categoryName} category...`} />
        </Grid>

        <Grid item lg={12}>
          <CategoryPopularPaths categoryName={categoryName} />
        </Grid>

        <Grid item lg={12}>
          <CategoryAllPaths
            categoryName={categoryName}
            paths={paths} />
        </Grid>

      </Grid>
    )
  }
}

const mapState = state => {
  return {
    pathsInCategory: state.pathReducer.allPathsInCategory
  }
}

const mapDispatch = dispatch => {
  return {
    getAllCategoryPaths: (categoryName) => {
      return dispatch(getAllPathsInCategory(categoryName))
    }
  }
}

export default connect(mapState, mapDispatch)(CategorySinglePage)