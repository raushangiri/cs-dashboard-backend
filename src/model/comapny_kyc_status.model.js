const { string } = require("joi");
const mongoose = require("mongoose");
const kycSchema = new mongoose.Schema(
  {
    companyname: {
      type: String,
      required: true,
    },
    company_email: {
      type: String,
      required: true,
    },
    userid: {
      type: String,
      required: true,
    },
    cac: {
      type: String,
      // required: true,
    },
    tcc: {
      type: String,
      // required: true,
    },
    itf: {
      type: String,
      // required: true,
    },
    pancom: {
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
    cacdocument: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      // default: "inactive",
    },
    cacdocument_remark: {
      type: String,
      // default: "inactive",
    },
    tccnumber: {
      type: String,
    },
    tccdocument: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      // default: "inactive",
    },
    tccdocument_remark: {
      type: String,
      // default: "inactive",
    },
    itfdocument: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      // default: "inactive",
    },
    itfdocument_remark: {
      type: String,
      // default: "inactive",
    },
    pancomdocument: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      // default: "inactive",
    },
    pancomdocument_remark: {
      type: String,
      // default: "inactive",
    },
    remark: {
      type: String,
      //   required: true,
    },
    allocation_date: {
      type: String,
      //   required: true,
    },
    // nameOfRepresentive: {
    //   type: String,
    //   required: true,
    // },
    // rcNumber: {
    //   type: String,
    //   required: true,
    // },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);
const kyc = mongoose.model("kyc_status", kycSchema);
module.exports = kyc;
