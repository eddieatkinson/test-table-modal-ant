import React, { Component } from "react";
import { connect } from "react-redux";

import Main from "./containers/Main";

import GetConfigAction from "./redux/actions/GetConfigAction";

class App extends Component {
  componentDidMount() {
    this.props.GetConfigAction();
  }
  render() {
    return <Main />;
  }
}

export default connect(null, {
  GetConfigAction,
})(App);
