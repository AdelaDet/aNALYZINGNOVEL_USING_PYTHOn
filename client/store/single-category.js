import axios from 'axios'



const FIND_ALL_ITEMS_IN_A_CATEGORY = 'FIND_ALL_ITEMS_IN_A_CATEGORY'


const initialState = {
    paths: [],
    resources: [],
    name: '',
    url: ''
}


const returnAllItemsInCategory = (categoryItem) => {
  const {category, content} = categoryItem
  return {
    type: FIND_ALL_ITEMS_IN_A_CATEGORY,
    name: category,
    content
  }
}

/**
 * THUNK CREATORS
 */
export const createGetSingleCategoryThunk = (category) => {
   return async (dispatch) => {
      const response = await axios.get(`/api/categories/${category}/search`)
      const content = response.data.map(item => {
        const rating = item._fields[1]
        const {labels, properties} = item._fields[0]
        const {description, level, name, status, url, uid, slug} = properties
        return {type: labels[0], uid, slug, description, level, name, rating, url, status: status || null}
     })
     dispatch(returnAllItemsInCategory({category, content}))
   }
}

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case FIND_ALL_ITEMS_IN_A_CATEGORY:
        const paths = action.content.filter(item => item.type === 'Path')
        const resources = action.content.filter(item => item.type === 'Resource')
        return { paths, resources, name: action.name }
    default:
      return state
  }
}
