import React from 'react'

const styles = {
  container: {
    width: 800,
    display: 'table',
    margin: '0 auto'
  },
  header: {
    textAlign: 'center',
    fontWeight: 400,
    lineHeight: 1.4,
    fontSize: '2.2em',
    color: '#2a3b47'
  }
}

const CallToAction = ({text}) => {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>{text}</h1>
    </div>
  )
}

export default CallToAction
