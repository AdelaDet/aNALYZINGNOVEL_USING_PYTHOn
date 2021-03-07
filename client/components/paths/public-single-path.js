
import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from "styled-components"
import {ResourceCard} from '../resources'

import { getSinglePathByUidThunk, followPathThunk, getSingleUserPathsThunk  } from '../../store'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Button from '@material-ui/core/Button'


const styles = {
  container: {
    backgroundColor: 'white',
    borderWidth: '1px',
    borderColor: '#efefef',
    borderStyle: 'solid'
  },
  header: {
    textAlign: 'center',
    fontWeight: 100
  }
}

class PublicSinglePath extends Component {
  constructor(props){
    super(props)

    this.state = {
      selectedItems: []
    }
  }

  componentDidMount = () => {
    const uid = this.props.match.params.pathUid
    this.props.getPath(uid)
    this.props.getUserPaths(this.props.user.name)
  }

  followPath = () => {
    const {uid, slug} = this.props.path[0][0].details.properties
    const path = this.props.path[0]
    this.props.followPath(uid, slug, this.props.user.uid, path)
  }

  userFollowsPath = (paths) => {
    const pathIds = paths.map((path) => {
      return path[0].details.properties.uid
    })
    return pathIds.includes(this.props.path[0][0].details.properties.uid)
  }

  renderPath = () => {
    const steps = this.props.path[0][0].steps
    const { userPaths } = this.props
    const isFollowing = this.userFollowsPath(userPaths)
    const { description, level, name, owner, slug, status, uid } = this.props.path[0][0].details.properties
    return (
      <PageContainer>
        <PathContainer>
          <h1 style={styles.header} >{name}</h1>
          {
            this.props.user.name && !isFollowing && <Button
              variant="outlined"
              color="primary"
              onClick={this.followPath}
            >
            copy this path to my dashboard
            </Button>

          }
          <div style={styles.container}>
            <List>
              { steps.length > 1 &&
                steps.map(step => {
                  const stepUrl = step.resource.properties.url
                  return (
                  <ResourceCard
                    key={step.resource.identity.low}
                    isLoggedIn={false}
                    resourceProperties={step.resource.properties}
                  />
                  )
              } ) }
            </List>
          </div>
        </PathContainer>
        </PageContainer>
      )}

  render(){

    if(this.props.path.length){
      return(
        this.renderPath()
      )
    }else{
    return (
      <span />
    )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    path: state.pathReducer.singlePath,
    user: state.user,
    userPaths: state.pathReducer.allUserPaths
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getPath: (uid) => {
      dispatch(getSinglePathByUidThunk(uid))
    },
    followPath: (pathUid, slug, userUid, path) => {
      dispatch(followPathThunk(pathUid, slug, userUid, path))
    },
    getUserPaths: (userName) => {
      dispatch(getSingleUserPathsThunk(userName))
    }

  }
}

const PathContainer = styled.div`
  width: 80vw
  display: flex
  justify-content: center
  flex-direction: column
  margin-top: 20px
`

const PageContainer = styled.div`
  width: 90vw;
  display: flex;
  justify-content: center
`

export default connect(mapStateToProps, mapDispatchToProps)(PublicSinglePath)