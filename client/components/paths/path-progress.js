import React from 'react'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'

const PathProgress = ({progress}) => {
  return (
    <div>
      <Typography
        align="right"
        variant="body2">
        Complete: {progress}%
      </Typography>
      <LinearProgress
        variant="determinate"
        value={progress}
      />
    </div>
  )
}

export default PathProgress
