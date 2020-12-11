import React from 'react'
import { connect } from 'react-redux'
import { CategoryCard } from './index'
import { getPopularCategoriesThunk } from '../../store'
import Grid from '@material-ui/core/Grid'

const styles = {
  container: {
    padding: '0 20px',
    textAlign: 'center',
    marginBottom: 50,
  },
  inner: {
    textAlign: 'center',
    centerWrap: {
      display: 'inline-block'
    }
  },
  header: {
    textAlign: 'center',
    fontWeight: 300,
    paddingBottom: 40,
    fontSize: 36
  }
}

class PopularCategories extends React.Component {
  componentDidMount(){
    this.props.getPopularCategories()
  }

  createImageSlug = (str) => {
    return str.toLowerCase().replace(/\s/g, '')
  }

  render() {
    const popularCategories = this.props.popularCategories
    return(
      <div style={styles.container}>
        <h2 style={styles.header}>Popular Categories</h2>
        <Grid container spacing={40}>
        {
          (popularCategories)
          ? popularCategories.map(cat =>
            <Grid item xs={3} key={cat.Category.identity.low}>
              <CategoryCard
                imageSlug={this.createImageSlug(cat.Category.properties.name)}
                categoryName={cat.Category.properties.name}
                pathCount={cat.Paths.low}
              />
            </Grid>
          )
          : null
        }
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return({
    popularCategories : state.category.popularCategories,
  })
}

const mapDispatchToProps = (dispatch) => {
  return({
    getPopularCategories : () => dispatch(getPopularCategoriesThunk()),
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(PopularCategories)
