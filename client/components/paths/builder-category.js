
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { getAllParentCategoriesThunk } from '../../store'

import { withStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'

const styles = theme => ({
  formControl: {
    marginTop: 10,
    marginBottom: 10,
    width: 250
  }
})

class BuilderCategory extends Component {
  componentDidMount(){}
  render() {
    const {classes, category} = this.props
    return (
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="age-native-simple">Select a language category</InputLabel>
        <Select
          native
          value={category}
          inputProps={{
            name: 'language',
            id: 'path-lang',
          }}
          required={true}
        >
          <option value="" />
          {
            this.props.parentCategories.map((cat) => {
              return (
                <option
                  key={cat}
                  value={cat}>
                  {cat}
                </option>
              )
            })
          }
        </Select>
      </FormControl>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    parentCategories: state.category.allParentCategories
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getParentCategories: () => {
      dispatch(getAllParentCategoriesThunk())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(BuilderCategory))
