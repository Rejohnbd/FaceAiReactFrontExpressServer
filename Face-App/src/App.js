import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// import logo from './logo.svg';
// import './App.css';
import { FaceLogin, NidUser, NotFound, Welcome } from "./pages";

class App extends Component {
  state = {
    nidUser: false,
  };

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Welcome} />
          <Route exact path="/face-login" component={FaceLogin} />
          <Route exact path="/nid-user" component={NidUser} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

export default App;
