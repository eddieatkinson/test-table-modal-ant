const config = {
  //Table Configuration
  tableConfig: {
    //Define config for All columns
    paymentEnabled: true, //if action enabled is true, then there will be a last column with Button, which when clicked will open the modal - that either shows Adjust / Payment or Both
    adjustEnabled: true, // if payment is enabled and Adjustment is enabled, then the user can use Credit. else he can only do payment (using credit card)
    columns: [
      {
        fieldName: "vendorId",
        displayName: "Vendor ID",
        display: false,
        filteringEnabled: false,
        sortingEnabled: true,
      },
      {
        fieldName: "vendor",
        displayName: "Vendor",
        display: true,
        filteringEnabled: false,
        sortingEnabled: true,
      },
      {
        fieldName: "quantity",
        displayName: "Quantity",
        display: true,
        filteringEnabled: false,
        sortingEnabled: true,
      },
      {
        fieldName: "amountBal",
        displayName: "Amount Bal",
        display: true,
        filteringEnabled: false,
        sortingEnabled: true,
      },
      {
        fieldName: "amountDue",
        displayName: "Amount Due",
        display: true,
        filteringEnabled: false,
        sortingEnabled: true,
      },
      {
        fieldName: "creditBal",
        displayName: "Credit Bal",
        display: true,
        filteringEnabled: false,
        sortingEnabled: true,
      },
    ],
  },
  dataEndPoints: {
    call2: { path: "/invoices" },
    call3: { path: "/vendors" },
    creditPost: { path: "/processcredit" },
    paymentPost: { path: "/processpayment" },
  },
};

module.exports = config;
