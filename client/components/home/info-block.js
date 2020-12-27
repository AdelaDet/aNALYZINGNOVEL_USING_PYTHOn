
import React from 'react'

const styles = {
  container: {
    padding: '0 20px',
    textAlign: 'center'
  },
  header: {
    fontWeight: 300,
    marginBottom: 50,
    fontSize: '1.5em',
    color: '#2a3b47'
  },
  icon: {
    fontSize: '46px'
  }
}

const InfoBlock = ({title, content, icon}) => {
  return (
    <div style={styles.container}>
      <i style={styles.icon} className="material-icons">{icon}</i>
      <h1 style={styles.header}>{title}</h1>
      <p>{content}</p>
    </div>
  )
}

export default InfoBlock