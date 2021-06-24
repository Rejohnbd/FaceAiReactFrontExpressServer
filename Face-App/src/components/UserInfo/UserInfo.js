import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@material-ui/core";

import companyLogo from "../../img/logo.png";

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

class UserInfo extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { classes } = this.props;
    const {
      userName,
      userImage,
      nidNo,
      pensiontype,
      dateOfBirth,
      currentPayPoint,
    } = this.props.userInfo;

    return (
      <Grid item sm={8} md={5}>
        <div className={classes.paper}>
          <Card className={classes.card}>
            <CardMedia
              className={classes.cardMedia}
              image={`https://118.67.215.228:2800/public/${userImage}`}
              title={userName}
            />
            <CardContent className={classes.cardContent}>
              <Typography gutterBottom variant="h5" component="h2">
                {userName}
              </Typography>
              <Typography>NID:&nbsp;{nidNo}</Typography>
              <Typography>PensionType:&nbsp;{pensiontype}</Typography>
              <Typography>Date of Birth:&nbsp;{dateOfBirth}</Typography>
              <Typography>
                Current Payment Type:&nbsp;{currentPayPoint}
              </Typography>
            </CardContent>
          </Card>

          <Typography variant="h6" className={classes.mt20}>
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
export default withStyles(styles)(UserInfo);
