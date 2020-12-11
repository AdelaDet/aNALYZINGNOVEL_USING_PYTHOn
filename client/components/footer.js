import React from 'react'
import { Link } from 'react-router-dom'

const styles = {
  footer: {
    width: '100%',
    height: 110,
    borderTop: '1px solid #efefef',
    backgroundColor: 'white',
    marginTop: 100,
    textAlign: 'center',
    paddingTop: 10
  },
  content: {
    height: 100,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    resize: 'vertical',
    overflow: 'auto'
  },
  links: {
    display: 'inline-block',
    paddingBottom: 10
  },
  logo: {
    margin: '10px 0',
    fontSize: 18
  }
}

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.content}>
 