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
        default:""
    },
    previous_product_model: {
        type: String,
        default:""
    },
    previous_loan_sanction_date: {
        type: String,
        default:""
    },
    customer_name: {
        type: String,
        default:""
    },
    previous_loan_type: {
        type: String,
        default:""
    },
    previous_loan_amount: {
        type: String,
        default:""
    },
    previous_loan_insurance_value: {
        type: String,
        default:""
    }
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  });
  const overview_details = mongoose.model("loan_file_overview", overview_schema);
  module.exports = overview_details;
  