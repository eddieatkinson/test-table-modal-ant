import React, { Component } from "react";
import { connect } from "react-redux";

class Table extends Component {
  render() {
    console.log(this.props.config); // To see if we are getting the configuration settings
    return <div>Table</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.data,
    config: state.config,
  };
};

export default connect(mapStateToProps)(Table);
