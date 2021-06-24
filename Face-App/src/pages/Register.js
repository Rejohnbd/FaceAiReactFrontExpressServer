import React, { Component } from "react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";
import Loader from "react-loader-spinner";
import { withStyles } from "@material-ui/core/styles";
import { Button, Container, TextField, Typography } from "@material-ui/core";
import faceServerInstance from "../utils/FaceDataServer";
import Swal from "sweetalert2";

import companyLogo from "../img/logo.png";
import cameraNotFound from "../img/camera_not_found.jpg";

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  cameraNotFound: {
    width: "400px",
    height: "300px",
  },
  regiterBtn: {
    marginTop: "5px",
  },
});

const videoConstraints = {
  width: 400,
  height: 300,
  facingMode: "user",
};

class Register extends Component {
  constructor() {
    super();

    this.state = {
      nid: "",
      error: null,
      nidUser: false,
      mediaError: false,
      mediaLoading: true,
    };

    this.webcamRef = React.createRef(null);
  }

  userMediaHander = (callback) => {
    if (callback.active) {
      this.setState({ mediaLoading: false });
    }
  };

  userMediaErrorHander = (callback) => {
    this.setState({ mediaError: true });
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
      const base64Format = this.webcamRef.current.getScreenshot();

      const datas = {
        task: "FACE_REGISTRATION",
        file: base64Format.substring(23),
        userid: nid,
      };

      this.registerUser(datas);
    } else {
      this.setState({ error: "Provide Valid NID Number." });
      return;
    }
  };

  registerUser = async (datas) => {
    await faceServerInstance
      .post("/predict", datas)
      .then((response) => {
        console.log(response);
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

  //   checkUserNid = async (nidNo) => {
  //     await dataServerInstance
  //       .post("/user/checknid", nidNo)
  //       .then((response) => {
  //         if (response.status === 200) {
  //           this.setState({ nidUser: true });
  //           this.props.history.push({
  //             pathname: "/nid-user",
  //             userData: response.data,
  //           });
  //         }
  //       })
  //       .catch((err) => {
  //         if (err.response.status === 404) {
  //           Swal.fire({
  //             icon: "error",
  //             title: "Sorry",
  //             text: err.response.data.message,
  //           });
  //         }
  //       });
  //   };

  render() {
    const { classes } = this.props;
    let mediaErrorComponent = (
      <>
        <img
          className={classes.cameraNotFound}
          src={cameraNotFound}
          alt="Camera Not Found"
        />
        <Typography variant="h6" className={classes.mediaErrorText}>
          Camera Not Found or Meda error. Try Again.
        </Typography>
        <Button
          component={Link}
          to="/"
          fullWidth
          variant="contained"
          color="primary"
          size="large"
        >
          Back to Home &amp; Try Again
        </Button>
      </>
    );
    return (
      <Container maxWidth="xs">
        <div className={classes.paper}>
          <img src={companyLogo} alt="Company Logo" />
          <Typography component="h1" variant="h5">
            User Register
          </Typography>
          <TextField
            error={this.state.error ? true : false}
            helperText={this.state.error ? this.state.error : ""}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="User Id"
            name="nid"
            type="number"
            value={this.state.phone}
            onChange={this.onChangeHandler}
          />
          <Webcam
            audio={false}
            ref={this.webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            onUserMedia={this.userMediaHander}
            onUserMediaError={this.userMediaErrorHander}
          />

          {this.state.mediaError ? (
            mediaErrorComponent
          ) : this.state.mediaLoading ? (
            <div className={classes.mediaLoading}>
              <Loader type="Puff" color="#00BFFF" height={100} width={100} />
              <Typography variant="subtitle2">
                Pleae wait camera loading...
              </Typography>
            </div>
          ) : (
            <Button
              className={classes.regiterBtn}
              fullWidth
              variant="contained"
              color="secondary"
              onClick={this.onSubmitHandler}
            >
              Click for Register
            </Button>
          )}
        </div>
      </Container>
    );
  }
}
export default withStyles(styles)(Register);
