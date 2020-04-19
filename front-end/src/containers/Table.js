import React, { Component } from "react";
import { connect } from "react-redux";
import { Table as AntTable, Button } from "antd";
import { forEach, map, find } from "lodash";
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
        render: (text, record) => {
          console.log(text);
          console.log(record);
          const disabled = !(record.amountDue > 0);
          return <Button disabled={disabled}>Pay</Button>;
        },
      });
    }
    return columns;
  }
  getData() {
    const { vendors, invoices } = this.props.data;
    const data =
      invoices &&
      map(invoices, (invoice, i) => {
        return {
          key: i,
          vendor: find(vendors, { vendorId: invoice.vendorId }).vendorName,
          quantity: invoice.quantity,
          amountBal: invoice.amountBal,
          amountDue: invoice.amountDue,
          creditBal: invoice.creditBal ? invoice.creditBal : 0,
        };
      });
    return data;
  }
  render() {
    const columns = this.getColumns();
    const data = this.getData();

    return <AntTable columns={columns} dataSource={data} />;
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.data,
    tableConfig: state.config.configData.tableConfig,
  };
};

export default connect(mapStateToProps)(Table);
