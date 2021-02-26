
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
import Chip from '@material-ui/core/Chip'
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import StarRatingComponent from 'react-star-rating-component';

const styles = {
  container: {
    backgroundColor: 'white',
    borderWidth: '1px',
    borderColor: '#efefef',
    borderStyle: 'solid'
  },
  deleteButton: {
    marginTop: 20,
    marginLeft: 20,
    float: 'right'
  },
  chip: {
    fontWeight: 100,
    marginRight: 20
  }
}

class SinglePath extends Component {
  constructor(props){
    super(props)

    let pathStepsArray =  this.props.path[0].steps || []

    this.state = {
      selectedItems: [],
      cleared: false,
      open: false,
      pathStars: 0,
      review: '',
      pathSteps: pathStepsArray,
    }
  }

  componentDidMount = () => {
    const path = this.props.path[0]
//    const pathReview = this.props.pathReview
    if(path.steps.length > 1) {
      const pathUid = path.details.properties.uid
      const username = this.props.user
      this.props.getCompletedSteps(pathUid, username)
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.path[0] !== this.props.path[0]){

      const pathUid = nextProps.path[0].details.properties.uid
      const username = this.props.user
      const pathStepsArray =  nextProps.path[0].steps || []

      this.setState({
        pathSteps: pathStepsArray
      })

      this.props.getCompletedSteps(pathUid, username)
      this.props.getPathRating(pathUid, username)
    }
  }

  handleCompletedClick = stepUrl => async () => {
    const pathUid = this.props.path[0].details.properties.uid
    const username = this.props.user
    const bool = await this.checkForComplete(stepUrl)

    this.props.toggleStepCompletion(pathUid, username, stepUrl, bool)
  }

  handleDeletePath = (event) => {
    event.preventDefault()
    const pathName = this.props.path[0].details.properties.name
    const uid = this.props.path[0].details.properties.uid
    const subscribers = Number(this.props.path[0].subscribers.low - 1)
    const username = this.props.user

    if (window.confirm(`Are you sure you want to delete ${pathName}?  ${subscribers} other users subscribed to this path will no longer be able to access it.`)){
      this.props.deleteSinglePath(uid, username)
      history.push('/user/dashboard/add-new-path')
    }
  }

  handleOrderChange = (evt) => {

    const path = this.props.path[0]
    const pathUid = path.details.properties.uid
    //add 1 to each index since variable length queries
    //in neo4j start from index 1
    const oldIndex = evt.oldIndex + 1
    const newIndex = evt.newIndex + 1
    const stepCount = path.steps.length


    this.props.reorderSteps(pathUid,stepCount,oldIndex,newIndex)
  }

  handleUnfollowPath = (event) => {
    event.preventDefault()
    const { slug, uid } = this.props.path[0].details.properties
    const username = this.props.user
    this.props.unfollowPath(uid, username, slug)
    history.push('/user/dashboard/add-new-path')
  }

  checkForComplete = (url) => {
    const completedSteps = this.props.completedSteps
    let found = false

    for(let i = 0; i < completedSteps.length; i++) {
      const stepUrl = completedSteps[i].stepUrl
      if(stepUrl === url && completedSteps[i].completed) {
        found = true
        break
      }
    }
    return found
  }

  getCompletePercentage = () => {
    const steps = this.props.completedSteps
    const total = this.props.completedSteps.length
    let completed = 0

    if(steps.length === 0) {
      return 0
    } else {
      steps.forEach(step => step.completed ? completed++ : '')
      return Math.round( (completed / total) * 100 )
    }
  }

  captureReview = (event) => {
    this.setState({
      review: event.target.value
    })
  }


  onStarClick(event) {
    this.setState({
      pathStars: event,
      open: false
    });
    const ratingStars = event
    const ratingText = this.state.review
    const pathuid = this.props.path[0].details.properties.uid
    const username = this.props.user
    this.props.ratePath(username, pathuid, ratingText, ratingStars)
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render(){
    const { user, path, pathReview } = this.props
    const pathDetails = path[0].details.properties
    const status = pathDetails.status
    const pathSteps = path[0].steps
    const pathUid = pathDetails.uid
    const isOwner = pathDetails.owner === user

    return (
      <div>
        <h2>
          { pathDetails.status === 'draft' &&
            <Chip label='Private Path' style={styles.chip}/>
          }
          {pathDetails.name}
        </h2>
        <p>{pathDetails.description}</p>

        { pathSteps[0].step !== null &&
          <PathProgress progress={this.getCompletePercentage()} />
        }
        <div style={styles.container}>
        <Sortable
          options={{
            animation: 100,
            onStart: (evt) => {
              evt.item.style.opacity          = 0.2
            },
            onEnd: (evt) => {
              evt.item.style.opacity          = ""
            },
            onSort: (evt) => {
            },

            handle: ".resource-handle"
          }}
          ref={(c) => {
              if (c) {
                  this.sortable = c.sortable;
              }
          }}
          onChange={(order, sortable, evt) => {
            this.handleOrderChange(evt)
          }}
        >
          {

            this.state.pathSteps[0].step !== null &&
              this.state.pathSteps.map((step, stepIdx) => {
                const stepUrl = step.resource.properties.url
                return (
                  <ResourceCard
                    key={step.resource.identity.low}
                    isLoggedIn={!!user}
                    userUid={user.uid}
                    isOwner={path[0].details.properties.owner === user}
                    resourceProperties={step.resource.properties}
                    handleCompletedClick={() => this.handleCompletedClick(stepUrl)}
                    checkForComplete={() => this.checkForComplete(stepUrl)}
                    removeResourceCard={() => this.props.removeResourceFromPath(pathUid, pathSteps.length, stepIdx+1)}
                  />
                )
              })

            }
        </Sortable>
        { path[0].details.properties.owner === user &&
          <AddResource user={user} path={path} />
        }
        </div>


        { path[0].details.properties.owner === user &&
          <div>
            <Button
              style={styles.deleteButton}
              onClick={this.handleDeletePath}
              variant="outlined"
              color="secondary"
            >
            Delete Path
            </Button>

            <PathToggleStatus
              uid={path[0].details.properties.uid}
              Status={status}
              style={styles.status}
              toggle={this.props.togglePublic}
              username={this.props.user}
              />

          </div>
        }

        { !isOwner &&
          <div>


            <Button
              style={styles.deleteButton}
              onClick={this.handleUnfollowPath}
              variant="outlined"
              color="secondary"
            >
            Unfollow Path
            </Button>

            <Button
              style={styles.deleteButton}
              onClick={this.handleClickOpen}
              variant="outlined"
              color="primary"
            >
            Review Path
            </Button>
            <p>{pathReview}</p>
              <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title" >
                <DialogTitle id="form-dialog-title">Write a Review</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    what did you think of this path?
                  </DialogContentText>
                      <textarea rows="10" cols="75"
                      id="review"
                      type="text"
                      value={this.state.review}
                      onChange={this.captureReview}
                      ></textarea>
                </DialogContent>
                <DialogActions>
                  <StarRatingComponent
                        name="stars"
                        editing={true}
                        starCount={5}
                        value={this.state.pathStars}
                        onStarClick={this.onStarClick.bind(this)}
                      />
                </DialogActions>
              </Dialog>
            </div>


        }

      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    completedSteps: state.step.completedSteps,
    displayedPathReview: state.reviews.pathReview
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteSinglePath: (uid, username) => {
      dispatch(deleteSinglePathThunk(uid, username))
    },
    getCompletedSteps: (pathUid, username) => {
      dispatch(getStepCompletionSingleUserThunk(pathUid, username))
    },
    toggleStepCompletion: (pathUid, username, stepUrl, bool) => {
      dispatch(toggleStepCompletionThunk(pathUid, username, stepUrl, bool))
    },
    removeResourceFromPath: (pathId, lastIndex, stepIndex) => {
      dispatch(removeResourceFromPathThunk(pathId, lastIndex, stepIndex))
    },
    togglePublic: (uid, status, username) => {
      dispatch(togglePublicThunk(uid, status, username))
    },
    unfollowPath: (uid, user, slug) => {
      dispatch(unfollowPathThunk(uid, user, slug))
    },
    ratePath: (username, pathuid, ratingText, ratingStars) => {
      dispatch(addPathReviewThunk(username, pathuid, ratingText, ratingStars))
    },
    getPathRating: (username, pathuid) => {
      dispatch(getCurrentPathReviewThunk(username, pathuid))
    },
    reorderSteps: (pathUid, stepCount, fromIndex, toIndex) => {
      dispatch(reorderStepsThunk(pathUid, stepCount, fromIndex, toIndex))
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SinglePath))