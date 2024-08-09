const mongoose = require("mongoose");
const management_roleSchema = new mongoose.Schema(
  {
    representative_request_id: {
      type: String,
      required: true,
    },
    admin_user_id: {
      type: String,
      // required: true,
    },
    management_user_id: {
      type: String,
      // required: true,
    },
    cto_user_id: {
      type: String,
      // required: true,
    },
    helpdesk_cac_docurl_status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    helpdesk_other_docurl_status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    cto_cac_docurl_status: {
      type: String,
      enum: [, "PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    cto_other_docurl_status: {
      type: String,
      enum: [, "PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    management_cac_docurl_status: {
      type: String,
      enum: [, "PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    management_other_docurl_status: {
      type: String,
      enum: [, "PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    helpdeskAgent_id: {
      type: String,
    },
    helpdeskAgent_details_status: {
      type: String,
      enum: [, "PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    cto_details_status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    management_details_status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    request_date: {
      type: String,
      required: true,
    },
    request_status: {
      type: String,
      enum: ["ASSIGN", "PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    allocation_date: {
      type: String,
      //   required: true,
    },
    helpdesk_doc_remark: {
      type: String,
    },
    management_doc_remark: {
      type: String,
    },
    cto_doc_remark: {
      type: String,
    },
    helpdesk_details_remark: {
      type: String,
    },
    management_details_remark: {
      type: String,
    },
    cto_details_remark: {
      type: String,
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
const managemnetData = mongoose.model("management_role", management_roleSchema);
module.exports = managemnetData;
