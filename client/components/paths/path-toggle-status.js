import React, {Component} from 'react'
import Switch from '@material-ui/core/Switch'

class PathToggleStatus extends Component {

  handleChange = () => {
    this.props.toggle(this.props.uid, this.props.Status === 'draft' ? 'public' : 'draft', this.props.username)
  }

  render() {
    return (
      <div>
        <p>Toggle Path Public or Private</p>
        <Switch
          checked={this.props.Status === 'public'}
          onChange={this.handleChange}
          value="status"
          color="primary"
        />
      </div>
    )
  }
}

export default PathToggleStatus
