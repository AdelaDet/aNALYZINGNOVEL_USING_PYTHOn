
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
    width: '100%'
  },
  textContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flexStart',
    alignItems: 'flexStart',
    width: '100%',
    paddingLeft: 20
  },
  title: {
    fontSize: 16,
    position: 'relative',
    top: 25
  },
  resourceType: {
    float: 'right',
    position: 'relative',
    right: 20
  },
  cover: {
    width: 75,
    height: 75,
    objectFit: 'cover'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flexStart',
    alignItems: 'flexStart',
    flexGrow: 10
  },
  ratingCount: {
    marginLeft: 5
  },
  xButtonHover: {
    cursor: 'pointer',
  },
  xButton: {
    opacity: 0.3,
    fontSize: "14px", 
    fontColor: "#AAAAAA",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flexEnd',
    justifyContent: 'flexStart',
  },
}

class ResourceCard extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      expanded : false,
      totalAvg: 0,
      totalReviews: 0,
      ratingOpen: false
    }
  }

  componentDidMount = () => {
    const resourceUid = this.props.resourceProperties.uid

    const body = {
      userUid: this.props.user.uid,
      resourceUid
    }

    this.props.getResourceReviews(resourceUid)
    this.props.getUserResourceRating(body)
  }

  handleDropdownCollapse = () => {
    this.setState({
      expanded: false,
    })
  }

  handleClickOpen = () => {
    this.setState({
      ratingOpen: true
    })
  }

  handleClose = () => {
    this.setState({ ratingOpen: false })
  }

  handleDropdownExpand = () => {
    const uid = this.props.resourceProperties.uid
    this.getCommunityRating(uid)
    this.setState({
      expanded: true
    })
  }


  getCommunityRating = (uid) => {
    const found =  this.props.reviews.find((item) => {
      return item.resource.uid === uid
    })

    this.setState({
      totalAvg: found.resource.totalAvg,
      totalReviews: found.resource.totalReviews
    })
  }

  render() {
    const {isLoggedIn, isOwner} = this.props
    const {classes, theme} = this.props
    const resourceImg = this.props.resourceProperties.imageUrl

    return(
      <div style={styles.container}>
          <Card className={classes.card}>
              <div className={classes.details}>
              {isLoggedIn &&
                <Checkbox
                  onChange={this.props.handleCompletedClick()}
                  checked={this.props.checkForComplete()}
                  disableRipple
                />
              }
              </div>
              <div className={classes.row}>
                <a href={this.props.resourceProperties.url} target="_blank">
                <div className={classes.imageSide}>
                  <img style={styles.cover} src={resourceImg ? resourceImg : "../../default.png" } />
                </div>
                </a>
                <a className={classes.textContent} href={this.props.resourceProperties.url} target="_blank">
                <div>
                  <Grid container>
                    <Grid item xs={9}>
                      <Typography style={styles.title} variant="title"> {this.props.resourceProperties.name} </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <div style={styles.resourceType}>
                        { this.props.resourceProperties.type &&
                          <Chip label={this.props.resourceProperties.type} />
                        }
                      </div>
                    </Grid>
                  </Grid>
                </div>
                </a>
              </div>
              <div className={classes.details}>
                { this.state.expanded ?
                  <ExpandLess onClick={() => this.handleDropdownCollapse()} /> :
                  <ExpandMore onClick={() => this.handleDropdownExpand()} />
                }
              </div>

              { (isLoggedIn && isOwner) &&

                <div className={classes.details}>
                  <div className="resource-handle" >
                    <i className="material-icons">
                      <div className={classes.handle}>
                        reorder
                      </div>
                    </i>
                  </div>
                </div>
              }

              { (isLoggedIn && isOwner) &&
                 <div className={classes.xButton}  onClick={()=>this.props.removeResourceCard()} >
                   <div className={classes.xButtonHover}>
                     x
                   </div>
                 </div>
              }

        </Card>
        <Collapse
          in      = {this.state.expanded}
          timeout = "auto" unmountOnExit
        >
          <List component="div">
            <ListItem>
              <Stars value={this.state.totalAvg}/>
              <span style={styles.ratingCount}>({this.state.totalReviews})</span>
            </ListItem>

            <ListItem>
            <Button onClick={this.handleClickOpen} variant="outlined">Rate this resource</Button>
              <Dialog open={this.state.ratingOpen}>
                <ResourceRating
                  userRating={this.props.resourceRating}
                  resourceUid = {this.props.resourceProperties.uid}
                  resourceName = {this.props.resourceProperties.name}
                  userUid={this.props.userUid}
                  handleClose={this.handleClose}
                />
              </Dialog>
            </ListItem>

            <ListItem>
              <Typography style={styles.description}><b>Description</b>: {this.props.resourceProperties.description}</Typography>
            </ListItem>
            { this.props.resourceProperties.level &&
              <ListItem>
                <Typography><b>Level</b>: {this.props.resourceProperties.level}</Typography>
              </ListItem>
            }
            <ListItem>
              <Typography>Visit <a href={this.props.resourceProperties.url} target="_blank">
                {this.props.resourceProperties.name}</a>
              </Typography>
            </ListItem>
          </List>
        </Collapse>

      </div>
    )
  }
}

ResourceCard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

const mapState = (state) => {
  return({
    user: state.user,
    reviews: state.reviews.allResourceReviews,
    resourceRating: state.reviews.resourceReviewRating
  })
}

const mapDispatch = (dispatch) => {
  return({
    getResourceReviews : (resourceName) => {
      dispatch(getAllReviewsOfResource(resourceName))
    },
    lastUserResourceReview: (body) => {
      dispatch(getUserResourceReview(body))
    },
    getUserResourceRating: (body) => {
      dispatch(getUserResourceReview(body))
    }
  })
}

export default connect(mapState, mapDispatch)(withStyles(styles, { withTheme: true })(ResourceCard))