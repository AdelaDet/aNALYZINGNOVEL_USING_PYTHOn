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
    const { data } = await axios.get(`/api/paths/${pathuid}/${username}/get-review`)
    const score = data.records[0]._fields[0]
    const comments = data.records[0]._fields[1]
    dispatch(getCurrentPathReview({score, comments}))
  }
}

export const addPathReviewThunk = (username, pathuid, ratingText, ratingStars) => {
  return async (dispatch) => {
    const { data } = await axios.post(`/api/paths/${pathuid}/rate-path`, {username, pathuid, ratingText, ratingStars})
    const {score, comments} = data.records[0]._fields[0].properties
    dispatch(reviewPath({score, comments}))
  }
}

export const getAllReviewsOfResource = (uid) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/resources/${uid}/reviews`)
    dispatch(setAllReviewsOfResource(data))
  }
}

export const addResourceReview = (rating) => {
  return async (dispatch) => {
    await axios.post(`/api/userAuth/reviews/review`, rating)
  }
}

export const getUserResourceReview = (body) => {
  return async (dispatch) => {
    const 