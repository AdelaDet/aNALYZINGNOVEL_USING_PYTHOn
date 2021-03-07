import React from 'react'
import { Link } from 'react-router-dom'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'

const styles = {
  container: {
    backgroundColor: 'white',
    borderWidth: '1px',
    borderColor: '#efefef',
    borderStyle: 'solid'
  },
  header: {
    textAlign: 'center'
  },
  noPaths: {
    textAlign: 'center',
    paddingLeft: 20,
    paddingRight: 20
  }
}

const PathUserDirectory = ({paths, handleSelect, selected}) => {
  let active = false
  return (
    <div style={styles.container}>
      <h4 style={styles.header}>My Paths Directory</h4>
      { paths.length === 0 ? (
        <div style={styles.noPaths}>
          <p>No learning paths yet! Why not <Link to="/">add</Link> or <Link to="/user/dashboard/add-new-path">create</Link> one?</p>
        </div>
      ) : (
        <MenuList>
        { paths.map((path) => {
          const uid = path[0].details.properties.uid
          const name = path[0].details.properties.name

          if (selected.details){
            active = selected.details.properties.uid === uid
          }
            return (
              <MenuItem
                key={uid}
                onClick={() => handleSelect(uid)}
                selected={active}
              >
                {name}
              </MenuItem>
            )
          })
        }
      </MenuList>
      )

      }
    </div>
  )
}

export default PathUserDirectory
