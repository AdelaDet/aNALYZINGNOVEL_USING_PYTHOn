import axios from 'axios'

const SET_ALL_REVIEWS_OF_RESOURCE = 'SET_ALL_REVIEWS_OF_RESOURCE'
const GOT_USER_RESOURCE_REVIEW = 'GOT_USER_RESOURCE_REVIEW'
const REVIEW_PATH = 'REVIEW_PATH'
const GET_CURRENT_PATH_REVIEW = 'GET_CURRENT_PATH_REVIEW'

const reviewPath = (review) => {
  return {
    type: REVIEW_PATH,
    review
  }
}

const getCurrentPathReview = (review) => {
  return {
    type: GET_CURRENT_PATH_REVIEW,
    review
  }
}

const setAllReviewsOfResource = (reviews, uid) => {
  return {
    type: SET_ALL_REVIEWS_OF_RESOURCE,
    reviews,
    uid
  }
}

const gotUserResourceReview = (rating) => {
  return {
    type: GOT_USER_RESOURCE_REVIEW,
    rating
  }
}

export const getCurrentPathReviewThunk = (username, pathuid) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/paths/${pathuid}/${username}/get-revi