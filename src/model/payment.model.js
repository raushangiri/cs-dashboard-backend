const { date } = require("joi");
const mongoose = require("mongoose");
// const paymentscherma = new mongoose.Schema();
const paymentmodel = new mongoose.Schema(
  {
    registration_Object_id: {
      type: String,
      required: true,
    },
    employees: [
      {
        employee_id: {
          type: String,
        },
        amount: {
          type: Number,
        },
        email: {
          type: String,
        },
        name: {
          type: String,
        },
      },
    ],
    employeesIds: {
      type: String,
      // required: true,
    },
    rrr_expirty_date: {
      type: String,
      required: true,
    },
    transaction_id: {
      type: String,
      required: true,
    },
    rrr: {
      type: String,
      required: true,
    },
    dateTime: {
      type: String,
    },
    total_amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    paymentmode: {
      type: String,
      required: true,
    },
    bankname: {
      type: String,
      required: true,
    },
    employeecount: {
      type: Number,
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

const payment = mongoose.model("payment", paymentmodel);
module.exports = payment;
