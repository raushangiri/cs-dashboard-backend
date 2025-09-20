const mongoose = require("mongoose");
const bank_master_schema = new mongoose.Schema(
  {
        Loan_Type: {
            type: String,
        },
        Bank_Name: {
            type: String,
        },
        rm1_name: {
            type: String,
        },
        rm1_contact_number: {
            type: String,
        },
        rm2_name: {
            type: String,
        },
        rm2_contact_number: {
            type: String,
        },
        email_1: {
            type: String,
        },
        email_2: {
            type: String,
        },
        email_3: {
            type: String,
        },

  });
  const bank_details = mongoose.model("bank_master", bank_master_schema);
  module.exports = bank_details;
  