const mongoose = require("mongoose");

const overview_schema = new mongoose.Schema(
  {
    file_number: {
      type: String,
      required: true,
      unique: true,
    },
    mobile_number: {
      type: String,
    },
    previous_loan_bank_name: {
      type: String,
      default: "",
    },
    previous_product_model: {
      type: String,
      default: "",
    },
    previous_loan_sanction_date: {
      type: String,
      default: "",
    },
    customer_name: {
      type: String,
      default: "",
    },
    previous_loan_type: {
      type: String,
      default: "",
    },
    previous_loan_amount: {
      type: String,
      default: "",
    },
    previous_loan_insurance_value: {
      type: String,
      default: "",
    },
    previous_loan_insurance_bank_name: {
      type: String,
      default: "",
    },
    permanentAddress: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    companyName: {
      type: String,
      default: "",
    },
    salary: {
      type: String,
      default: "",
    },
    selfEmployee: {
      type: String, // If it's a boolean value, change to Boolean
      default: false, // Assuming default is false
    },
    companyNumber: {
      type: String,
      default: "",
    },
    companyAddress: {
      type: String,
      default: "",
    },
    emailId: {
      type: String,
      default: "",
    },
    tenure: {
      type: String,
      default: "",
    },
    carName: {
      type: String,
      default: "",
    },
    carDetails: {
      type: String,
      default: "",
    },
    model: {
      type: String, // Fixing typo to 'model' instead of 'modal'
      default: "",
    },
    carNumber: {
      type: String,
      default: "",
    },
    // Add additional fields as needed
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

const overview_details = mongoose.model("loan_file_overview", overview_schema);
module.exports = overview_details;
