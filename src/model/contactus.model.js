const { string } = require("joi");
const mongoose = require("mongoose");
const contactSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    user_email: {
      type: String,
      required: true,
    },
    userid: {
      type: String,
      required: true,
    },
    request_date: {
      type: String,
      required: true,
    },
    request_status: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      required: true,
    },
    agent_id: {
      type: String,
      // required: true,
    },
    remark: {
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
const contactus = mongoose.model("contactreport", contactSchema);
module.exports = contactus;
