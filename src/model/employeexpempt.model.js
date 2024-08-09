const mongoose = require("mongoose");
const exemptSchema = new mongoose.Schema(
  {
    employee_id: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    givenname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phonenumber: {
      type: String,
      required: true,
    },
    userid: {
      type: String,
      // required: true,
    },
    passportnumber: {
      type: String,
      // required: true
    },
    passportexpiry: {
      type: String,
      // required: true
    },
    uploadpassport: {
      type: String,
      // required: true
      default: "",
    },
    cerpac_number: {
      type: String,
      // required: true
    },
    cerpac_expiry: {
      type: String,
      // required: true
    },
    cerpac_front: {
      type: String,
      // required: true,
      default: "",
    },
    cerpac_back: {
      type: String,
      // required: true,
      default: "",
    },
    visatype: {
      type: String,
      required: true,
    },
    visanumber: {
      type: String,
      // required: true,
    },
    visa_document: {
      type: String,
      // required: true,
    },
    visaexpiracydate: {
      type: String,
      // required: true,
    },
    request_date: {
      type: String,
      required: true,
    },
    request_status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    helpdesdesk_request_status: {
      type: String,
      enum: ["PENDING", "ASSIGN", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    cto_request_status: {
      type: String,
      enum: ["PENDING", "ASSIGN", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    helpdesk_doc_remark: {
      type: String,
      // required: true,
    },
    cto_doc_remark: {
      type: String,
      // required: true,
    },
    management_doc_remark: {
      type: String,
      // required: true,
    },
    management_request_status: {
      type: String,
      enum: ["PENDING", "ASSIGN", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    paymentstatus: {
      type: Boolean,
      default: false,
    },
    helpdesk_agent_id: {
      type: String,
      // required: true,
    },
    cto_agent_id: {
      type: String,
      // required: true,
    },
    management_agent_id: {
      type: String,
      // required: true,
    },

    helpdesk_exempt_document_one_status: {
      type: String,
      enum: ["PENDING", "ASSIGN", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    helpdesk_exempt_document_two_status: {
      type: String,
      enum: ["PENDING", "ASSIGN", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    cto_exempt_document_one_status: {
      type: String,
      enum: ["PENDING", "ASSIGN", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    cto_exempt_document_two_status: {
      type: String,
      enum: ["PENDING", "ASSIGN", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    management_exempt_document_one_status: {
      type: String,
      enum: ["PENDING", "ASSIGN", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    management_exempt_document_two_status: {
      type: String,
      enum: ["PENDING", "ASSIGN", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    exempt_document_one: {
      type: String,
      required: true,
    },
    exempt_document_two: {
      type: String,
      required: true,
    },
    helpdesk_remark: {
      type: String,
      // required: true,
    },
    cto_remark: {
      type: String,
      // required: true,
    },
    management_remark: {
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
const exempt = mongoose.model("employee_exempt", exemptSchema);
module.exports = exempt;
