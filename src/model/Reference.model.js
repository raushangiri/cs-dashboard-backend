const mongoose = require("mongoose");
const reference_schema = new mongoose.Schema(
  {
    file_number: {
        type: String,
    },
reference_name: {
        type: String,
    },
reference_mobile_number: {
        type: String,
    },
occupation_type: {
        type: String,
    },
nature_of_business: {
        type: String,
    },
company_name: {
        type: String,
    },
reference_address: {
        type: String,
    },


  });
  const reference_details = mongoose.model("reference_details", reference_schema);
  module.exports = reference_details;
  