import React, { Component } from "react";
import { connect } from "react-redux";
import { Table as AntTable } from "antd";
import { forEach } from "lodash";
import "antd/dist/antd.css";

class Table extends Component {
  getColumns() {
    const columns = [];
    this.props.tableConfig &&
      forEach(this.props.tableConfig.columns, (column) => {
        if (column.display) {
          columns.push({
            title: column.displayName,
            dataIndex: column.fieldName,
          });
        }
      });
    if (this.props.tableConfig && this.props.tableConfig.paymentEnabled) {
      columns.push({
        title: "Pay",
        dataIndex: "pay",
      });
    }
    return columns;
  }
  render() {
    const columns = this.getColumns();
    return <AntTable columns={columns} />; // To make sure it works
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.data,
    tableConfig: state.config.configData.tableConfig,
  };
};

export default connect(mapStateToProps)(Table);
