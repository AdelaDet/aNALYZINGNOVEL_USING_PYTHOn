import axios from 'axios'

const SET_ALL_REVIEWS_OF_RESOURCE = 'SET_ALL_REVIEWS_OF_RESOURCE'

const setAllReviewsOfResource = (reviews) => {
  return {
    type: SET_ALL_REVIEWS_OF_RESOURCE,
    