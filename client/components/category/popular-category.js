import React from 'react'
import { connect } from 'react-redux'
import { CategoryCard } from './index'
import { getPopularCategoriesThunk } from '../../store'
import Grid from '@material-ui/core/Grid'

const styles = {
  container: {
    padding: '0 20px',
 