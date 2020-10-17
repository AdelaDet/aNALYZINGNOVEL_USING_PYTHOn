import React from 'react'
import Card from '@material-ui/core/Card'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'

const styles = {
  container: {
    paddingBottom: 30,
    paddingTop: 20
  },
  header: {
    fontSize: 32,
    fontWeight: 300
  }
}

const CategoryCard = ({imageSlug, categoryName, pathCount}) => {
  return(
    <div>
      <Link to={`/category/${categoryName}`}>
        <Card style={styles.container}>
          <img src={`/category-logos/${imageSlug}.png`} width={75} />
          <h2 style={styles.header}>{categoryName}</h2>
          <Button color="primary">
            {pathCount} Learning Path{pathCount > 1 ? 's' : ''}
          </Button>
        </Card>
      </Link>
    </div>
  )
}

export default CategoryCard
