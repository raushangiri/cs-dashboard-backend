const { string } = require("joi");
const mongoose = require("mongoose");
const documentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    // emp_registration_id: {
    //   type: String,
    //   required: true,
    // },
    cac_doc: {
      type: String,
      required: true,
    },
    tcc_doc: {
      type: String,
      // required: true,
    },
    expatriate_quota_position: {
      type: String,
      // required: true,
    },
    additional_docname: {
      type: String,
      // required: true,
    },
    company_name: {
      type: String,
      required: true,
    },
    agent_id: {
      type: String,
    },
    cac_doc_status: {
      type: String,
      default: "inactive",
    },
    tcc_doc_status: {
      type: String,
      // default: "inactive",
    },
    expatriate_doc_status: {
      type: String,
      // default: "inactive",
    },
    additional_doc_status: {
      type: String,
      // default: "inactive",
    },
    request_date: {
      type: String,
      required: true,
    },
    request_status: {
      type: Boolean,
      default: false,
    },
    remark: {
      type: String,
      //   required: true,
    },
    resolution_timestamp: {
      type: String,
      //   required: true,
    },
    additional_doc: {
      type: String,
      // required: true,
    },
    allocation_date: {
      type: String,
      //   required: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

const companyDoc = mongoose.model("companyDoc", documentSchema);
module.exports = companyDoc;
