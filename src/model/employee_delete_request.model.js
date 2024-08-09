const mongoose = require("mongoose");
const deleteemployeeSchema = new mongoose.Schema(
  {
    company_id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    employee_id: {
      type: String,
      required: true,
    },
    company_name: {
      type: String,
      required: true,
    },
    company_email: {
      type: String,
      required: true,
    },
    employee_givenname: {
      type: String,
      required: true,
    },
    rc_number: {
      type: String,
      required: true,
    },
    employee_surname: {
      type: String,
      required: true,
    },
    employee_email: {
      type: String,
      required: true,
    },
    request_date: {
      type: String,
      required: true,
    },
    request_status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "ASSIGN"],
      default: "PENDING",
    },
    agent_id: {
      type: String,
      //   required: true,
    },
    allocation_date: {
      type: String,
      //   required: true,
    },
    quota_doc: { type: String, required: true },
    quota_doc_status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "ASSIGN"],
      default: "PENDING",
    },
    remark: {
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
const deleteemployeeSchema_requestData = mongoose.model(
  "delete_employee_request",
  deleteemployeeSchema
);
module.exports = deleteemployeeSchema_requestData;
