
import axios from 'axios'

/**
 * ACTION TYPES
 */
const SEARCH_FOR_CATEGORY = 'SEARCH_FOR_CATEGORY'
const GET_ALL_PARENT_CATEGORIES = 'GET_ALL_PARENT_CATEGORIES'
const SET_POPULAR_CATEGORIES = 'SET_POPULAR_CATEGORIES'

/**
 * ACTION CREATORS
 */
const getAllParentCategories = (categories) => {
  return {
    type: GET_ALL_PARENT_CATEGORIES,
    categories
  }
}

const setPopularCategoriesAC = (popularCategories) => {
  return {
    type: SET_POPULAR_CATEGORIES,
    popularCategories,
  }
}

/**
 * THUNK CREATORS
 */
export const getAllParentCategoriesThunk = () => {
  return async (dispatch) => {
    const { data } = await axios.get('/api/categories/all/parent')
    dispatch(getAllParentCategories(data))
  }
}

export const getPopularCategoriesThunk = () => {
  return async (dispatch) => {
    const res = await axios.get('/api/categories/popular')
    dispatch(setPopularCategoriesAC(res.data))
  }
}

/**
 * REDUCER
 */

const initialState = {
  foundCategories: [],
  popularCategories: [],
  allParentCategories: []
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SEARCH_FOR_CATEGORY:
      return {...state, foundCategories: action.foundCategories}
    case GET_ALL_PARENT_CATEGORIES:
      return {...state, allParentCategories: action.categories}
    case SET_POPULAR_CATEGORIES:
      return {...state, popularCategories: action.popularCategories}
    default:
      return state
  }
}