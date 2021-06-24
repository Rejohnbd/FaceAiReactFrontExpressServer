import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Webcam from "react-webcam";
import Loader from "react-loader-spinner";
import faceServerInstance from "../utils/FaceDataServer";
import dataServerInstance from "../utils/DataServer";
import Swal from "sweetalert2";
import { Button, Container, Grid, Typography } from "@material-ui/core";

import cameraNotFound from "../img/camera_not_found.jpg";
import WelcomeSidebar from "../components/WelcomeSidebar/WelcomeSidebar";
import UserInfo from "../components/UserInfo/UserInfo";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
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

const videoConstraints = {
  width: 550,
  height: 300,
  facingMode: "user",
};

class FaceLogin extends Component {
  constructor() {
    super();

    this.state = {
      imgSrc: null,
      mediaError: false,
      mediaLoading: true,
      userInfo: {},
    };

    this.webcamRef = React.createRef(null);
  }

  userMediaHander = (callback) => {
    // console.log(callback, "userMediaHander");
    if (callback.active) {
      this.setState({ mediaLoading: false });
    }
  };

  userMediaErrorHander = (callback) => {
    // console.log(callback, "userMediaErrorHander");
    this.setState({ mediaError: true });
  };

  screenshotCaptureHandler = () => {
    // console.log(this.webcamRef.current, "this");
    const base64Format = this.webcamRef.current.getScreenshot();
    // console.log(base64Format.substring(23));
    // this.setState({ imgSrc: base64Format });

    const datas = {
      task: "FACE_MATCHING_WITH_SPOOF",
      file: base64Format.substring(23),
    };

    // const datas = {
    //   user_id: "hasan",
    //   task: "FACE_MATCHING",
    //   file: base64Format.substring(23),
    // };

    this.checkUserFace(datas);
  };

  checkUserFace = async (datas) => {
    console.log("Send base64");
    await faceServerInstance
      .post("/predict", datas)
      .then((response) => {
        console.log(response);

        if (
          response.data.bbox !== null &&
          (response.data.user_id !== "unknown") & (response.data.spoof === "no")
        ) {
          console.log(response.data.user_id);
          const nidNo = {
            nidNo: response.data.user_id,
          };
          this.checkUserNid(nidNo);
        }
        if (response.data.bbox === null) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Face Not Found. Try Again!",
          });
        }

        if (
          response.data.bbox !== null &&
          response.data.user_id === "unknown"
        ) {
          Swal.fire("Face Not Matched", "Try Again......", "question");
        }

        if (response.data.bbox !== null && response.data.spoof === "yes") {
          Swal.fire({
            icon: "warning",
            title: "Alert !",
            text: "Please Provide Real Face",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        // if (err.response.status === 404) {
        //   Swal.fire({
        //     icon: "error",
        //     title: "Sorry",
        //     text: err.response.data.message,
        //   });
        // }
      });
  };

  checkUserNid = async (nidNo) => {
    await dataServerInstance
      .post("/user/checknid", nidNo)
      .then((response) => {
        if (response.status === 200) {
          this.setState({ userInfo: response.data.datas });
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
      <Grid container>
        <Grid item xs={12} sm={4} md={7}>
          <div className={classes.videoWrapper}>
            <Container maxWidth="sm">
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
                  <Loader
                    type="Puff"
                    color="#00BFFF"
                    height={100}
                    width={100}
                  />
                  <Typography variant="subtitle2">
                    Pleae wait camera loading...
                  </Typography>
                </div>
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={this.screenshotCaptureHandler}
                >
                  Click for Face Detect
                </Button>
              )}
              {this.state.imgSrc && (
                <img src={this.state.imgSrc} alt="capture user" />
              )}
            </Container>
          </div>
        </Grid>
        {Object.keys(this.state.userInfo).length === 0 ? (
          <WelcomeSidebar />
        ) : (
          <UserInfo userInfo={this.state.userInfo} />
        )}
      </Grid>
    );
  }
}
export default withStyles(styles)(FaceLogin);
