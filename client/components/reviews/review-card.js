import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import {Stars} from '../reviews'

const styles = {
  container: {
    backgroundColor: 'white',
    borderWidth: '1px',
    borderColor: '#efefef',
    borderStyle: 'solid'
  }
}

const ReviewCard = (props) => {

  return(
    <div style={styles.container}>
    <List>
      <ListItem>
      <ListItemText>
        {props.author}
      </ListItemText>
      <Stars value={props.rating} />
      </ListItem>
      <ListItem>
      <ListItemText>
        {props.comments}
      </ListItemText>
      </ListItem>
    </List>
    </div>
  )
}

export default ReviewCard
