const mongoose = require("mongoose");
const bank_master_schema = new mongoose.Schema(
  {
        Loan_Type: {
            type: String,
        },
        Bank_Name: {
            type: String,
        },
        Rm_Name: {
            type: String,
        },
        Rm_contact_number: {
            type: String,
        }
  });
  const bank_details = mongoose.model("bank_master", bank_master_schema);
  module.exports = bank_details;
  