import React, { Component } from "react";
import { connect } from "react-redux";

class Table extends Component {
  render() {
    console.log(this.props.data); // to ensure redux is wired correctly
    return <div>Table</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.data,
  };
};

export default connect(mapStateToProps)(Table);
