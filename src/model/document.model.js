const mongoose = require("mongoose");
const document_schema = new mongoose.Schema(
  {
    Type_of_loan: {
            type: String,
        },
        Loan_category: {
            type: String,
        },
        Document: {
            type: String,
        }
  });
  const documents = mongoose.model("document", document_schema);
  module.exports = documents;
  