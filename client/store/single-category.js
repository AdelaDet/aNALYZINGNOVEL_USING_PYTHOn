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
export const createGetSingleCategoryThunk = (c