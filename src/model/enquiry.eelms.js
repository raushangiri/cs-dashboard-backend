const mongoose = require("mongoose");
const enquirySchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    user_email: {
      type: String,
      required: true,
    },
    contact_number: {
      type: String,
      required: true,
    },
    userid: {
      type: String,
      // required: true,
    },
    request_date: {
      type: String,
      required: true,
    },
    request_status: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: true,
    },
    agent_id: {
      type: String,
      // required: true,
    },
    country_code: {
      type: String,
      required: true,
    },
    reply: {
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
const enquiries = mongoose.model("enquiry", enquirySchema);
module.exports = enquiries;
