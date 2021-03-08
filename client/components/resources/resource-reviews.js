
import React from 'react'
import {connect} from 'react-redux'
import {ReviewCard} from '../reviews'
import {getAllReviewsOfResource} from '../../store'

const ResourceReviews = (props) => {
  const reviews = props.reviews[props.resourceName]
  return(
    <div>
      { reviews && <h3> Top Reviews: </h3> }
      {
        reviews &&
            reviews.map(rev => {
              return(
                <div >
                  <ReviewCard 
                    author={rev.author}
                    rating={rev.score.low}
                    comments={rev.comments}
                  />
                </div>
              )
            })
      }
    </div>
  )
}

export default (ResourceReviews)
