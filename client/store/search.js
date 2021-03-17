
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