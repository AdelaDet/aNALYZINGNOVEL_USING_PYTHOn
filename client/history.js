import createHistory from 'history/createBrowserHistory'
import createMemoryHistory from 'history/createMemoryHistory'

import ReactGA from 'react-ga'
ReactGA.initialize('UA-121827451-1')


const history =
  process.env.NODE_ENV === 'test' ? createMemoryHistory() : createHistory()

    history.listen((location, action) => {
      ReactGA.set({ page: location.pathname })
      ReactGA.pageview(location.pathname)
    })

export default history
