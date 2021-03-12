
import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_SINGLE_PATH = 'GET_SINGLE_PATH'
const GET_PATHS_SINGLE_USER = 'GET_PATHS_SINGLE_USER'
const ADD_NEW_PATH = 'ADD_NEW_PATH'
const ADD_STEP_TO_PATH = 'ADD_STEP_TO_PATH'
const DELETE_SINGLE_PATH = 'DELETE_SINGLE_PATH'
const TOGGLE_PUBLIC = 'TOGGLE_PUBLIC'
const FOLLOW_PATH = 'FOLLOW_PATH'
const UNFOLLOW_PATH = 'UNFOLLOW_PATH'


const SET_ALL_PATHS_IN_CATEGORY = 'SET_ALL_PATHS_IN_CATEGORY'
const SET_POPULAR_PATHS_IN_CATEGORY = 'SET_POPULAR_PATHS_IN_CATEGORY'
const SET_POPULAR_PATHS_IN_ALL_CATEGORIES = 'SET_POPULAR_PATHS_IN_ALL_CATEGORIES'
const SET_SEARCHED_PATHS_IN_CATEGORY = 'SET_SEARCHED_PATHS_IN_CATEGORY'

/**
 * ACTION CREATORS
 */
const getSingleUserPaths = (paths) => {
  return {
    type: GET_PATHS_SINGLE_USER,
    paths
  }
}

const addNewPath = (path) => {
  return {
    type: ADD_NEW_PATH,
    path
  }
}

const addStepToPath = (step) => {
  return {
    type: ADD_STEP_TO_PATH,
    step
  }
}

const getSinglePath = (path) => {
  return {
    type: GET_SINGLE_PATH,
    path
  }
}

const deleteSinglePath = (uid) => {
  return {
    type: DELETE_SINGLE_PATH,
    uid
  }
}

const togglePublic = (path) => {
  return {
    type: TOGGLE_PUBLIC,
    path
  }
}

const toggleStepCompletion = (step) => {
  return {
    type: TOGGLE_STEP_COMPLETION,
    step
  }
}

const setPopularPathsInCategory = (paths) => {
  return {
    type: SET_POPULAR_PATHS_IN_CATEGORY,
    paths
  }
}

const setPopularPathsInAllCategories = (paths) => {
  return {
    type: SET_POPULAR_PATHS_IN_ALL_CATEGORIES,
    paths
  }
}

const setAllPathsInCategory = (paths) => {
  return {
    type: SET_ALL_PATHS_IN_CATEGORY,
    paths
  }
}

const setSearchedPathsInCategory = (paths) => {
  return {
    type: SET_SEARCHED_PATHS_IN_CATEGORY,
    paths
  }
}

const followPath = (path) => {
  return {
    type: FOLLOW_PATH,
    path
  }
}

const unfollowPath = (pathUid) => {
  return {
    type: UNFOLLOW_PATH,
    pathUid
  }
}

/**
 * THUNK CREATORS
 */

/** Authed User Endpoint **/
export const addNewPathThunk = (path) => {
  return async (dispatch) => {
    const { data } = await axios.post('/api/userAuth/paths', path)
    dispatch(addNewPath(data))
  }
}

/** Authed User Endpoint **/
export const followPathThunk = (pathUid, slug, userUid, path) => {
  return async (dispatch) => {
    //need to migrate to using user uid, but for the time being will use userName
    const { data } = await axios.put(`/api/userAuth/paths/${slug}/${pathUid}/follow`, {userUid, pathUid})
    dispatch(followPath(path))
  }
}

export const unfollowPathThunk = (pathUid, username, slug) => {
  return async (dispatch) => {
    const { data } = await axios.put(`/api/userAuth/paths/${slug}/${pathUid}/unfollow`, {username, pathUid})
    dispatch(unfollowPath(pathUid))
  }
}

/** Authed User Endpoint **/
export const addStepToPathThunk = (username, pathUid, url, form, type) => {
  return async (dispatch) => {
    const urlEncoded = encodeURIComponent(url)
    const { data } = await axios.post(`/api/userAuth/paths/${pathUid}/user/${username}/step/${urlEncoded}`, {...form, type})
    dispatch(addStepToPath(data))
  }
}

/** Authed User Endpoint **/
export const getSingleUserPathsThunk = (username) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/userAuth/paths/all/user/${username}`)
    dispatch(getSingleUserPaths(data))
  }
}

export const getPopularPathsInAllCategories = () => {
  return async (dispatch) => {
    const res = await axios.get(`/api/paths/popular`)
    dispatch(setPopularPathsInAllCategories(res.data))
  }
}

/** Authed User Endpoint **/
export const deleteSinglePathThunk = (uid, username) => {
  return async (dispatch) => {
    const { data } = await axios.delete(`/api/userAuth/paths/${uid}`, { data: { username } })
    dispatch(deleteSinglePath(data))
  }
}

/** Authed User Endpoint **/
export const togglePublicThunk = (uid, status, username) => {
  const body = { [status]: '', username}
  return async dispatch => {
    const {data} = await axios.put(`/api/userAuth/paths/${uid}/togglePublic`, body)
    dispatch(togglePublic(data))
  }
}

export const getSinglePathByNameThunk = (name) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/paths/byName/${name}`)
    dispatch(getSinglePath(data))
  }
}

export const getSinglePathByUidThunk = (uid) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/paths/${uid}`)
    dispatch(getSinglePath(data))
  }
}

export const getPopularPathsInCategory = (categoryName) => {
  return async (dispatch) => {
    const res = await axios.get(`/api/categories/${categoryName}/popular-paths`)
    dispatch(setPopularPathsInCategory(res.data))
  }
}

export const getAllPathsInCategory = (categoryName) => {
  return async (dispatch) => {
    const res = await axios.get(`/api/categories/${categoryName}/all-paths`)
    dispatch(setAllPathsInCategory(res.data))
  }
}

export const getAllItemsInCategory = (categoryName) => {
  return async (dispatch) => {
    const res = await axios.get(`/api/categories/${categoryName}/search`)
    dispatch(returnAllItemsInCategory(res.data))
  }
}

export const searchPathsInCategory = (categoryName, searchVal) => {
  return async (dispatch) => {
    const res = await axios.get(`/api/categories/${categoryName}/search`, searchVal)
    dispatch(setSearchedPathsInCategory(res.data))
  }
}

export const removeResourceFromPathThunk = (pathId, lastIndex, stepIndex) => {
  return async (dispatch) => {
    const { data } = await axios.post(`/api/paths/remove/${pathId}/${lastIndex}/${stepIndex}`)
    dispatch(getSinglePath(data))
  }
}

export const reorderStepsThunk = (pathId, pathLength, fromIndex, toIndex) => {
  return async (dispatch) => {
    const { data } = await axios.post(`/api/paths/reorder/${pathId}/${pathLength}/${fromIndex}/${toIndex}`)
    dispatch(getSinglePath(data))
  }
}

const initialState = {
  allUserPaths: [],
  singlePath: [],
  popularPathsInCategory: [],
  popularPathsInAllCategories: [],
  allPathsInCategory: [],
  searchedPathsInCategory: []
}

/**
 * REDUCER
 */
export const pathReducer = ( state = initialState, action) => { // eslint-disable-line
  switch (action.type) {
    case ADD_NEW_PATH:
      return {...state, allUserPaths: [...state.allUserPaths, action.path]}
    case DELETE_SINGLE_PATH: {
      const allUserPaths = state.allUserPaths.filter(path => path[0].details.properties.uid !== action.uid)
      return {...state, allUserPaths}
    }
    case TOGGLE_PUBLIC: {
      return {...state, singlePath: action.path}
    }
    case GET_PATHS_SINGLE_USER:
      return {...state, allUserPaths: action.paths}
    case FOLLOW_PATH:
      return {...state, allUserPaths: [...state.allUserPaths, action.path]}
    case UNFOLLOW_PATH: {
        const allUserPaths = state.allUserPaths.filter(path => path[0].details.properties.uid !== action.pathUid)
        return {...state, allUserPaths}
      }
    case GET_SINGLE_PATH:
      return {...state, singlePath: action.path}
    case SET_POPULAR_PATHS_IN_CATEGORY:
      return {...state, popularPathsInCategory: action.paths}
    case SET_POPULAR_PATHS_IN_ALL_CATEGORIES:
      return {...state, popularPathsInAllCategories: action.paths}
    case SET_ALL_PATHS_IN_CATEGORY:
      return {...state, allPathsInCategory: action.paths}
    case SET_SEARCHED_PATHS_IN_CATEGORY:
      return {...state, searchedPathsInCategory: action.paths}
    default:
      return state
  }
}