
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PathProgress from './path-progress'
import {ResourceCard} from '../resources'
import AddResource from './add-resource'
import PathToggleStatus from './path-toggle-status'
import history from '../../history'
import Sortable from 'react-sortablejs'
import { ReviewPathDialog } from '../'
import {
       deleteSinglePathThunk,
       getStepCompletionSingleUserThunk,
       toggleStepCompletionThunk,
       togglePublicThunk ,
       unfollowPathThunk,
       addPathReviewThunk,
       getCurrentPathReviewThunk,
       reorderStepsThunk,
       removeResourceFromPathThunk
     } from '../../store'
import { withRouter } from 'react-router-dom'
import List from '@material-ui/core/List'
import Button from '@material-ui/core/Button'