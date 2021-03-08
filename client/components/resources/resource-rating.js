
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addResourceReview } from '../../store'
import StarRatingComponent from 'react-star-rating-component'

import { Button } from '@material-ui/core'

const styles = {
  container: {
    padding: '10px 20px'
  }
}

class ResourceRating extends Component {
  constructor() {
    super()

    this.state = {
      rating: 0
    }
  }

  componentDidMount = () => {
    this.setState({
      rating: this.props.userRating
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userRating !== this.props.userRating) {
      this.setState({
        rating: nextProps.userRating
      })
    }
  }

  onStarClick = async (nextValue, prevValue, name) => {
    this.setState({rating: nextValue})

    const rating = {
      userUid: this.props.user.uid,
      rating: nextValue,
      resourceUid: this.props.resourceUid
    }

    this.props.submitResourceReview(rating)
  }

  render(){
    const { rating } = this.state
    return (
      <div style={styles.container}>

        <h4>Rate {this.props.resourceName}</h4>
        <StarRatingComponent
          name="resource-rating"
          starCount={5}
          value={rating}
          onStarClick={this.onStarClick.bind(this)}
        />
        <Button onClick={this.props.handleClose} variant="outlined">Close</Button>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    submitResourceReview: (rating) => {
      dispatch(addResourceReview(rating))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResourceRating)