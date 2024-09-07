const mongoose = require("mongoose");
const document_schema = new mongoose.Schema(
  {
    type_of_loan: {
            type: String,
        },
        loan_category: {
            type: String,
        },
        Document: {
            type: String,
        }
  });
  const documents = mongoose.model("document", document_schema);
  module.exports = documents;
  