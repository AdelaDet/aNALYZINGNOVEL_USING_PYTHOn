import React from 'react'
import  Grid from '@material-ui/core/Grid'
import {PathCard} from '../paths'

const styles = {
  container: {
    padding: '0 20px',
    textAlign: 'center',
    marginTop: 50
  },
  header: {
    textAlign: 'center',
    fontWeight: 300,
    fontSize: 28
  },
  subheader: {
    textAlign: 'center',
    paddingBottom: 40
  }
}

const CategoryAllPaths = (props) => {
  const {paths, categoryName} = props
  const pathsCount = paths.length
  return(
    <div style={styles.container}>
      <h2 style={styles.header}>{