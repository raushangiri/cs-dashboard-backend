const mongoose = require("mongoose");
const reportschema = new mongoose.Schema(
  {
    surname: {
      type: String,
      // required: true,
    },
    givenname: {
      type: String,
      // required: true,
    },
    emp_registration_id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      // required: true,
    },
    report: {
      type: String,
      // required: true,
    },
    emp_card_status: {
      type: String,
      // required: true,
      enum: ["allowed", "informed", "detained"],
    },
    agentId: {
      type: String,
      required: true,
    },
    dependent_card_number: {
      type: String,
      // required: true,
    },
    dependent_card_status: {
      type: String,
      // required: true
      enum: ["allowed", "informed", "detained"],
    },
    role: {
      type: String,
      required: true,
    },
    reportingTime: {
      type: String,
      required: true,
    },
    additional_document: {
      type: String,
      default: " ",
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
const reportData = mongoose.model("reportdata", reportschema);
module.exports = reportData;
