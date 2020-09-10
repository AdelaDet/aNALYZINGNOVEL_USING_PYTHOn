
import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import {MainNav, Footer} from './components'
import Routes from './routes'

const App = () => {
  return (
    <div className="Site">
      <CssBaseline />
      <MainNav />
      <div className="Site-content">
        <Routes />
      </div>
      <Footer />
    </div>
  )
}

export default App