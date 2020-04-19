import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Button, Modal, Form, Input } from "antd";
import { forEach, map, find } from "lodash";
import "antd/dist/antd.css";

class Main extends Component {
  state = {
    visible: false,
    pressedVendor: {},
    displayCredit: true,
    amountDue: 0,
  };

  handlePayPress(record) {
    this.setState({
      visible: true,
      pressedVendor: find(this.props.data.vendors, {
        vendorId: record.vendorId,
      }),
      amountDue: record.amountDue,
    });
  }

  shouldDisplayCredit() {
    const shouldDisplayCredit =
      this.props.tableConfig &&
      this.props.tableConfig.adjustEnabled &&
      this.state.displayCredit &&
      this.state.pressedVendor.creditBal;
    return shouldDisplayCredit;
  }

  getModalTitle() {
    const title = this.shouldDisplayCredit() ? "Credit Adjustment" : "Payment";
    return title;
  }

  getModalContents() {
    const shouldDisplayCredit = this.shouldDisplayCredit();
    let firstLineLabel = "Amont Due",
      firstLineContents = this.state.amountDue,
      secondLineLabel = null,
      secondLineContents = <Input placeholder="Card Number" />;
    if (shouldDisplayCredit) {
      firstLineLabel = "Credit Balance";
      firstLineContents = this.state.pressedVendor.creditBal;
      secondLineLabel = "Amount Due";
      secondLineContents = this.state.amountDue;
    }

    return (
      <Form>
        <Form.Item label={firstLineLabel}>{firstLineContents}</Form.Item>
        <Form.Item label={secondLineLabel}>{secondLineContents}</Form.Item>
      </Form>
    );
  }

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
          const disabled = !(record.amountDue > 0);
          return (
            <Button
              type="primary"
              disabled={disabled}
              onClick={() => this.handlePayPress(record)}
            >
              Pay
            </Button>
          );
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
        const vendor = find(vendors, { vendorId: invoice.vendorId });
        return {
          key: i,
          vendor: vendor.vendorName,
          quantity: invoice.quantity,
          amountBal: invoice.amountBal,
          amountDue: invoice.amountDue,
          creditBal: vendor.creditBal ? vendor.creditBal : 0,
          vendorId: invoice.vendorId,
        };
      });
    return data;
  }

  render() {
    const columns = this.getColumns();
    const data = this.getData();
    const modalContents = this.state.visible && this.getModalContents();
    const modalTitle = this.state.visible && this.getModalTitle();

    return (
      <div>
        <Table columns={columns} dataSource={data} />
        <Modal title={modalTitle} visible={this.state.visible}>
          {modalContents}
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.data,
    tableConfig: state.config.configData.tableConfig,
  };
};

export default connect(mapStateToProps)(Main);
