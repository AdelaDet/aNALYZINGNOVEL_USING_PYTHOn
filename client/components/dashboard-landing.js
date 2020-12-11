
import React, { Component } from 'react'

import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const styles = {
  container: {
    padding: 20
  },
  buttonGroup: {
    marginTop: 20
  }
}

function getSteps() {
  return ['Select a learning path', 'Follow or create learning paths', 'Complete the resources in your path, comment, and rate!'];
}



function getStepContent(step) {
  switch (step) {
    case 0:
      return `To get started, add a learning path to your profile by selecting “Add New Path” above.
      Paths are a collection of resources pulled from the internet.
      You can add resources to your path by clicking on the plus sign on the bottom of your path and pasting a url into the pop-up box that appears. `;
      //OR, if you would like a suggestion, click the suggestion button on the bottom of your path.

    case 1:
      return `You can also subscribe to any learning path on Code Map by clicking the “Copy this path to my dashboard” button on the top of the selected path.
      To find paths you would like to follow, navigate to topic pages by using the “Categories” dropdown menu in the nav bar.  You can also use the search bar to look up learning paths and categories by name.`;
    case 2:
      return `Keep track of your progress by checking the complete button.  We’ll show you your progress on the bar at the top of your path.  Happy learning!!`;
    default:
      return 'Unknown step';
  }
}

class DashboardLanding extends Component {

  state = {
    activeStep: 0,
  }

  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }))
  }

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }))
  }

  handleReset = () => {
    this.setState({
      activeStep: 0,
    })
  }

  render(){
    const steps = getSteps()
    const { activeStep } = this.state
    return (
      <div style={styles.container}>
        <Typography variant="title">Welcome to your code map dashboard</Typography>
        <br />
        <Typography variant="subheading">How to get started:</Typography>
        <br />
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  <Typography>{getStepContent(index)}</Typography>
                  <div>
                    <div style={styles.buttonGroup}>
                      <Button
                        disabled={activeStep === 0}
                        onClick={this.handleBack}
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleNext}
                      >
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                      </Button>
                    </div>
                  </div>
                </StepContent>
              </Step>
            )
          })}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0}>
            <Typography>Great job getting started! Good luck with your code learning goals!</Typography>
            <Button onClick={this.handleReset}>
              Reset
            </Button>
          </Paper>
        )}
      </div>
    )
  }
}

export default DashboardLanding