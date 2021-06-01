import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Webcam from "react-webcam";
import Loader from "react-loader-spinner";
import faceServerInstance from '../utils/FaceDataServer';
import {
  Button,
  Container,
  Grid,
  Typography,
} from "@material-ui/core";


import cameraNotFound from "../img/camera_not_found.jpg";
import Swal from "sweetalert2";
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
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  cardMedia: {
    marginTop: "20px",
    // paddingTop: "56.25%",
    width: "240px",
    height: "280px",
  },
  cardContent: {
    flexGrow: 1,
  },
  mt20: {
    marginTop: "20px",
  },
});

const videoConstraints = {
  width: 550,
  height: 300,
  facingMode: "user",
};

class NidUser extends Component {
  constructor() {
    super();

    this.state = {
      imgSrc: null,
      mediaError: false,
      mediaLoading: true,
      nidUser: {},
    };

    this.webcamRef = React.createRef(null);
  }

  componentDidMount() {
    if (this.props.location.userData === undefined) {
      this.props.history.push("/");
    } else {
      this.setState({ nidUser: this.props.location.userData.datas });
    }
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
    // console.log(this.state.nidUser.nidNo.toString());

    const datas = {
      user_id: (this.state.nidUser.nidNo).toString(),
      task: 'FACE_MATCHING_WITH_SPOOF',
      file: base64Format.substring(23)
    }
    
    this.checkUserFace(datas);
  };

  checkUserFace = async (datas) => {
    await faceServerInstance
      .post("/predict", datas)
      .then((response) => {
        console.log(response)
        // if (response.status === 200) {
        // // 
        // }
        if(response.data.bbox === null){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Face Not Found. Try Again!',
          })
        }

        if(response.data.bbox !== null && response.data.user_id === 'unknown'){
          Swal.fire(
            'Face Not Matched',
            'Try Again......',
            'question'
          )
        }

        if(response.data.bbox !== null && response.data.spoof === 'yes'){
          Swal.fire({
            icon: 'warning',
            title: 'Alert !',
            text: 'Please Provide Real Face',
          })
        }

      })
      .catch((err) => {
        console.log(err)
        // if (err.response.status === 404) {
        //   Swal.fire({
        //     icon: "error",
        //     title: "Sorry",
        //     text: err.response.data.message,
        //   });
        // }
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
                  Click for Face Recoginition
                </Button>
              )}
              {this.state.imgSrc && (
                <img src={this.state.imgSrc} alt="capture user" />
              )}
            </Container>
          </div>
        </Grid>
        <Grid item sm={8} md={5}>
          <UserInfo userInfo={this.state.nidUser} />
        </Grid>
      </Grid>
    );
  }
}
export default withStyles(styles)(NidUser);
