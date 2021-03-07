
import React from 'react'
import {Stars} from '../reviews'
import {connect} from 'react-redux'

import {getAllReviewsOfResource, getUserResourceReview} from '../../store'
import ResourceRating from './resource-rating'

import { Button, Grid, Checkbox, List, ListItem, Collapse, Card, Typography, Chip, Dialog} from '@material-ui/core'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const styles = {
  container: {
    backgroundColor: 'white',
    borderWidth: '1px',
    borderColor: '#efefef',
    borderStyle: 'solid',
  },
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 15
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  handle: {
    cursor: 'row-resize',
  },
  description: {