import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { Button, Container, TextField, Typography } from "@material-ui/core";
import dataServerInstance from "../utils/DataServer";
import Swal from "sweetalert2";

import companyLogo from "../img/logo.png";

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  phoneLogin: {
    margin: theme.spacing(3, 0, 2),
  },
  faceLogin: {
    margin: theme.spacing(2, 0, 2),
  },
});

class Welcome extends Component {
  state = {
    nid: "",
    error: null,
    nidUser: false,
  };

  onChangeHandler = (e) => {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value,
      error: null,
    });
  };

  onSubmitHandler = async (e) => {
    e.preventDefault();
    const nid = this.state.nid;

    if (nid.length === 10 || nid.length === 17) {
      const nidNo = {
        nidNo: nid,
      };

      this.checkUserNid(nidNo);
    } else {
      this.setState({ error: "Provide Valid NID Number." });
      return;
    }
  };

  checkUserNid = async (nidNo) => {
    await dataServerInstance
      .post("/user/checknid", nidNo)
      .then((response) => {
        if (response.status === 200) {
          this.setState({ nidUser: true });
          this.props.history.push({
            pathname: "/nid-user",
            userData: response.data,
          });
        }
      })
      .catch((err) => {
        if (err.response.status === 404) {
          Swal.fire({
            icon: "error",
            title: "Sorry",
            text: err.response.data.message,
          });
        }
      });
  };

  render() {
    const { classes } = this.props;
    return (
      <Container maxWidth="xs">
        <div className={classes.paper}>
          <img src={companyLogo} alt="Company Logo" />
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <TextField
            error={this.state.error ? true : false}
            helperText={this.state.error ? this.state.error : ""}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Enter NID Number"
            name="nid"
            type="number"
            value={this.state.phone}
            onChange={this.onChangeHandler}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            className={classes.phoneLogin}
            onClick={this.onSubmitHandler}
          >
            Login with NID
          </Button>
          <Typography variant="subtitle1" gutterBottom>
            Or
          </Typography>
          <Button
            component={Link}
            to="face-login"
            fullWidth
            variant="contained"
            color="secondary"
            size="large"
            className={classes.faceLogin}
          >
            Login with Face
          </Button>
        </div>
      </Container>
    );
  }
}
export default withStyles(styles)(Welcome);
