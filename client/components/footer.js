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
        <div style={styles.links}>
          A project by <a href='https://github.com/J-Hust'>Justin Hustrulid</a>, <a href='https://github.com/maubertw'>Mary Warrick</a>, <a href='https://github.com/chansiky'>Chan Youn</a> and <a href='https://github.com/jamigibbs'>Jami Gibbs</a>
        </div>
        <div style={styles.logo}>
          <i className="material-icons">explore</i>
        </div>
      </div>
    </footer>
  )
}

export default Footer
