import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Button, Modal, Form, Input } from "antd";
import { forEach, map, find, isEmpty } from "lodash";
import "antd/dist/antd.css";

import GetConfigAction from "../redux/actions/GetConfigAction";
import GetInvoicesAction from "../redux/actions/GetInvoicesAction";
import GetVendorsAction from "../redux/actions/GetVendorsAction";
import AdjustBalanceAction from "../redux/actions/AdjustBalanceAction";

class Main extends Component {
  state = {
    visible: false,
    displayCredit: true,
    pressedInvoiceData: {},
    cardNumber: null,
  };

  async componentDidMount() {
    await this.props.GetConfigAction();
    this.props.GetInvoicesAction(this.props.dataEndPoints.call2.path);
    this.props.GetVendorsAction(this.props.dataEndPoints.call3.path);
  }

  handlePayPress(record) {
    this.setState({
      visible: true,
      pressedInvoiceData: record,
    });
  }

  handleCancel() {
    this.setState({
      visible: false,
      displayCredit: true,
    });
  }

  shouldDisplayCredit() {
    const shouldDisplayCredit =
      this.props.tableConfig &&
      this.props.tableConfig.adjustEnabled &&
      this.state.displayCredit &&
      this.state.pressedInvoiceData.creditBal;
    return !!shouldDisplayCredit;
  }

  getModalTitle() {
    const title = this.shouldDisplayCredit() ? "Credit Adjustment" : "Payment";
    return title;
  }

  handleCardInput(e) {
    this.setState({
      cardNumber: e.target.value,
    });
  }

  getModalContents() {
    const shouldDisplayCredit = this.shouldDisplayCredit();
    let firstLineLabel = "Amont Due",
      firstLineContents = this.state.pressedInvoiceData.amountDue,
      secondLineLabel = null,
      secondLineContents = (
        <Input
          placeholder="Card Number"
          onChange={(e) => this.handleCardInput(e)}
        />
      );
    if (shouldDisplayCredit) {
      firstLineLabel = "Credit Balance";
      firstLineContents = this.state.pressedInvoiceData.creditBal;
      secondLineLabel = "Amount Due";
      secondLineContents = this.state.pressedInvoiceData.amountDue;
    }

    return (
      <Form>
        <Form.Item label={firstLineLabel}>{firstLineContents}</Form.Item>
        <Form.Item label={secondLineLabel}>{secondLineContents}</Form.Item>
      </Form>
    );
  }

  handlePaymentSubmit(shouldDisplayCredit, applyNoBalance) {
    let amountDue = this.state.pressedInvoiceData.amountDue;
    if (shouldDisplayCredit && !applyNoBalance) {
      amountDue =
        amountDue < this.state.pressedInvoiceData.creditBal
          ? 0
          : amountDue - this.state.pressedInvoiceData.creditBal;
    } else if (!shouldDisplayCredit) {
      amountDue = 0;
      // let invoiceInQuestion = this.props.data.invoices[
      //   this.state.pressedInvoiceData.key
      // ];
      // invoiceInQuestion.amountDue = 0;
      // console.log(invoiceInQuestion);
    }
    // let invoiceInQuestion = this.props.data.invoices[
    //   this.state.pressedInvoiceData.key
    // ];
    // invoiceInQuestion.amountDue = amountDue;
    // console.log(invoiceInQuestion);
    const input = {
      path: this.props.dataEndPoints.paymentPost.path,
      key: this.state.pressedInvoiceData.key,
      amountDue,
      invoices: this.props.data.invoices,
    };
    this.props.AdjustBalanceAction(input);

    this.setState({
      displayCredit: false,
    });
  }

  getFooter() {
    const shouldDisplayCredit = this.shouldDisplayCredit();
    const secondButtonContents = shouldDisplayCredit ? "Credit" : "Payment";
    const thirdButton = shouldDisplayCredit ? (
      <Button
        key="skip"
        type="default"
        onClick={() => this.handlePaymentSubmit(shouldDisplayCredit, true)}
      >
        Do Not Apply Credit
      </Button>
    ) : null;
    const footer = [
      <Button key="cancel" onClick={() => this.handleCancel()}>
        Cancel
      </Button>,
      <Button
        key="submit"
        type="primary"
        onClick={() => this.handlePaymentSubmit(shouldDisplayCredit)}
      >
        Apply {secondButtonContents}
      </Button>,
      thirdButton,
    ];
    return footer;
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
          key: invoice.invoiceId,
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
    const data = !isEmpty(this.props.data.vendors) && this.getData();
    const modalContents = this.state.visible && this.getModalContents();
    const modalTitle = this.state.visible && this.getModalTitle();
    const footer = this.state.visible && this.getFooter();

    return (
      <div>
        <Table columns={columns} dataSource={data} />
        <Modal
          title={modalTitle}
          visible={this.state.visible}
          onCancel={() => this.handleCancel()}
          footer={footer}
        >
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
    dataEndPoints: state.config.configData.dataEndPoints,
  };
};

export default connect(mapStateToProps, {
  GetConfigAction,
  GetInvoicesAction,
  GetVendorsAction,
  AdjustBalanceAction,
})(Main);
