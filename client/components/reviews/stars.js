
import React from 'react'
import StarRatingComponent from 'react-star-rating-component';
import styled from "styled-components";


const StarBox = styled.div`
  z-Index: 2;
`
/*
 * the 'unrated' prop can be passed down as true, or a falsey 'value' will 
 * make the stars display with a disabled color.
 */
const Stars = (props) => {
  const {value, unrated} = props
  const emptyColor = (!value || unrated) ?  "#c8c8c8" : "#a5a5a5"
  const filledColor = "#e5aa3d"
  return(
    <StarBox>
    <StarRatingComponent
          name="stars"
          editing={false}
          starCount={5}
          value={value}
          starColor={filledColor}
          emptyStarColor={emptyColor}
        />
    </StarBox>
  )
}

export default Stars