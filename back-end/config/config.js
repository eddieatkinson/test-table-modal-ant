const config = {
  //Table Configuration
  tableConfig: {
    //Define config for All columns
    paymentEnabled: false, //if action enabled is true, then there will be a last column with Button, which when clicked will open the modal - that either shows Adjust / Payment or Both
    adjustEnabled: true, // if payment is enabled and Adjustment is enabled, then the user can use Credit. else he can only do payment (using credit card)
    columns: [
      {
        fieldName: "vendorId",
        displayName: "Vendor ID",
        display: false,
        filteringEnabled: false,
        sortingEnabled: true,
      },
    ],
  },
  dataEndPoints: {
    call2: {},
    call3: {},
    creditPost: {},
    paymentPost: {},
  },
};

module.exports = config;
