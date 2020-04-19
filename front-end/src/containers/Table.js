import React, { Component } from "react";
import { connect } from "react-redux";
import { DatePicker } from "antd";
import "antd/dist/antd.css";

class Table extends Component {
  render() {
    return <DatePicker />; // To make sure it works
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.data,
    config: state.config,
  };
};

export default connect(mapStateToProps)(Table);
