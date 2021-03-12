import {createStore, combineReducers, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import user from './user'
import category from './category'
import {pathReducer} from './pathReducer'
import step from './step'
import singleCategory from './single-category'
import resource from './resource'
import searchMatches from './search'
import reviews from './reviews'

const reducer = combineReducers({
  user,
  pathRe