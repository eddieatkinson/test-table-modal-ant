import React, { Component } from "react";
import { connect } from "react-redux";

import Table from "./containers/Table";

import GetConfigAction from "./redux/actions/GetConfigAction";

class App extends Component {
  componentDidMount() {
    this.props.GetConfigAction();
  }
  render() {
    return <Table />;
  }
}

export default connect(null, {
  GetConfigAction,
})(App);
