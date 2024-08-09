const { string } = require("joi");
const mongoose = require("mongoose");
const kycSchema = new mongoose.Schema(
  {
    givenname: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    userid: {
      type: String,
      required: true,
    },
    cerpac_number: {
      type: String,
      // required: true,
    },
    cerpac_front: {
      type: String,
      // required: true,
    },
    cerpac_back: {
      type: String,
      // required: true,
    },
    uploadpassport: {
      type: String,
      // required: true,
    },
    passportexpiry: {
      type: String,
      // required: true,
    },
    agent_id: {
      type: String,
      //   required: true,
    },
    request_status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    request_date: {
      type: String,
      required: true,
    },
    resolution_timestamp: {
      type: String,
      //   required: true,
    },
    cerpac_front_status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
    },
    cerpac_front_status_remark: {
      type: String,
    },
    cerpac_back_status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
    },
    cerpac_expiry: {
      type: String,
    },
    cerpac_back_status_remark: {
      type: String,
    },
    visa_document_status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
    },
    visa_document_status_remark: {
      type: String,
    },
    visatype: {
      type: String,
      // required: true,
    },
    visanumber: {
      type: String,
      // required: true,
    },
    visaexpiracy: {
      type: String,
      // required: true,
    },
    visa_document: {
      type: String,
    },
    passportnumber: {
      type: String,
      // required: true,
    },
    company_name: {
      type: String,
    },
    uploadpassport_status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
    },
    uploadpassport_status_remark: {
      type: String,
    },
    remark: {
      type: String,
      //   required: true,
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
const kyc = mongoose.model("employee_kyc", kycSchema);
module.exports = kyc;
