import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Button, Modal, Form, Input } from "antd";
import { forEach, map, find, isEmpty } from "lodash";
import "antd/dist/antd.css";

import GetConfigAction from "../redux/actions/GetConfigAction";
import GetInvoicesAction from "../redux/actions/GetInvoicesAction";
import GetVendorsAction from "../redux/actions/GetVendorsAction";
import AdjustBalanceAction from "../redux/actions/AdjustBalanceAction";
import AdjustCreditAction from "../redux/actions/AdjustCreditAction";

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

  async handlePaymentSubmit(shouldDisplayCredit, applyNoBalance) {
    let pathKey = shouldDisplayCredit ? "creditPost" : "paymentPost";
    let amountDue = this.state.pressedInvoiceData.amountDue;
    let creditBal = this.state.pressedInvoiceData.creditBal;
    if (shouldDisplayCredit && !applyNoBalance) {
      creditBal = amountDue < creditBal ? creditBal - amountDue : 0;
      amountDue = amountDue < creditBal ? 0 : amountDue - creditBal;
    } else if (!shouldDisplayCredit) {
      amountDue = 0;
    }
    const input = {
      path: this.props.dataEndPoints[pathKey].path,
      key: this.state.pressedInvoiceData.key,
      amountDue,
      creditBal,
      invoices: this.props.invoices,
      vendors: this.props.vendors,
      vendorId: this.state.pressedInvoiceData.vendorId,
    };

    if (shouldDisplayCredit && !applyNoBalance) {
      await this.props.AdjustCreditAction(input);
    }
    await this.props.AdjustBalanceAction(input);

    this.setState({
      displayCredit: false,
    });
    this.props.GetInvoicesAction(this.props.dataEndPoints.call2.path);
    this.props.GetVendorsAction(this.props.dataEndPoints.call3.path);
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
    const { vendors, invoices } = this.props;
    const data =
      invoices &&
      map(invoices, (invoice) => {
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
    const data = !isEmpty(this.props.vendors) && this.getData();
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
    vendors: state.data.vendors,
    invoices: state.data.invoices,
    tableConfig: state.config.configData.tableConfig,
    dataEndPoints: state.config.configData.dataEndPoints,
  };
};

export default connect(mapStateToProps, {
  GetConfigAction,
  GetInvoicesAction,
  GetVendorsAction,
  AdjustBalanceAction,
  AdjustCreditAction,
})(Main);
