import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { Button, Container, Grid, Typography } from "@material-ui/core";

import companyLogo from "../../img/logo.png";
import faceAiIcon from "../../img/faceai.gif";


const styles = (theme) => ({
  
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  animImage: {
    maxWidth: "60%",
  },
  videoWrapper: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraNotFound: {
    width: "100%",
  },
  mediaErrorText: {
    textAlign: "center",
    color: "red",
  },
  mediaLoading: {
    width: "100%",
    height: "300",
    textAlign: "center",
  },
});



class WelcomeSidebar extends Component {
  constructor() {
    super();

    this.state = {
      
    };
  }
  
  render() {
    const { classes } = this.props;

     return (
        <Grid item sm={8} md={5}>
          <div className={classes.paper}>
            <img
              className={classes.animImage}
              src={faceAiIcon}
              alt="Face Detection Procress"
            />
            <Typography variant="h6">
              Face Detection App. Developed By
            </Typography>
            <img src={companyLogo} alt="Company Logo" />
            <Container maxWidth="xs">
              <Button
                component={Link}
                to="/"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
              >
                Back to Homepage
              </Button>
            </Container>
          </div>
        </Grid>
    );
  }
}
export default withStyles(styles)(WelcomeSidebar);
