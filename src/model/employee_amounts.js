const mongoose = require("mongoose");
const employeeAmountSchema = new mongoose.Schema(
  {
    employee_id: {
      type: String,
      required: true,
    },
    employeeamount_id: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    givenname: {
      type: String,
      required: true,
    },
    typeOfEmployee: {
      type: String,
      required: true,
    },
    sex: {
      type: String,
      required: true,
    },
    quota_expiry: {
      type: String,
      required: true,
    },
    amount_dollor: {
      type: String,
      required: true,
    },
    amount_niara: {
      type: String,
      required: true,
    },
    userid: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);
const employeeamount = mongoose.model("employee_amount", employeeAmountSchema);
module.exports = employeeamount;
