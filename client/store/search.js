
import axios from 'axios'


const SEARCH_ANY = 'SEARCH_ANY'

const initialState = {
    matches: []
}

const matchEverything = (matches) => {
  return {
    type: SEARCH_ANY,
    matches
  }
}

export const createFuzzyMatchThunk = (searchString) => {
  return async (dispatch) => {
      const response = await axios.post(`/api/search`, {searchString})
      const matches = response.data.map(item => {
      const {labels, properties} = item._fields[0]
      const {name, description, level, slug, uid, url} = properties
      return {type: labels[0], name, description, level, slug, uid, url}
     })
     dispatch(matchEverything(matches))
   }
}

export const createMatchAllInCategoryThunk = (searchString, category) => {
  return async (dispatch) => {
      const response = await axios.post(`/api/categories/${category}/search`, {searchString})
      const matches = response.data.map(item => {
        const {labels, properties} = item._fields[0]
        const {name, description, level, slug, uid} = properties
      return {type: labels[0], name, description, level, slug, uid}
     })
     dispatch(matchEverything(matches))
   }
}


export default function(state = initialState, action) {
  switch (action.type) {
    case SEARCH_ANY:
        return action.matches
    default:
      return state
  }
}