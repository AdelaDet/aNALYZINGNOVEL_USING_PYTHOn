
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    width: '75%',
    display: 'table',
    margin: '0 auto',
  },
  content: {
    marginTop: 20
  },
  buttons: {
    marginTop: 30
  },
  instructions: {
    height: 75,
    fontSize: 18,
    paddingLeft: 20,
    paddingRight: 20,
  }
}

function getSteps() {
  return ['Create an Account', 'Create a Learning Path', 'Check off Learned Resources', 'Share wih the Community'];
}

function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return "If you want to learn how to code, you'll quickly find that you have to teach yourself.  Code Map is a tool for developers to store all their online resources for learning in one place.";
    case 1:
      return "When you're learning a new piece of technology you might turn to Youtube, Medium, official docs, tutorials, Github, or any number of sources. With Code Map you can organize all your learning materials in one place.";
    case 2:
      return 'As you visit and complete each step on your path, check it off and rate the quality of the resource.';
    case 3:
      return 'If you think your path is really great, make it public and share it with other Code Mappers. The community can view and rate your learning paths.  Excellent paths and resources will be bumped to the top of or suggestion engine, ensuring the best online materials are highlighted!'
    default:
      return 'Uknown stepIndex';
  }
}

class HomeStepper extends React.Component {
  state = {
    activeStep: 0,
  };

  handleNext = () => {
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep + 1,
    });
  };

  handleBack = () => {
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep - 1,
    });
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <div className={classes.root}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map(label => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>