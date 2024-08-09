const { string } = require("joi");
const mongoose = require("mongoose");
const helpdeskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone_no: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    gender: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      //   required: true,
    },
    emailpassword: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      required: true,
      enum: [
        "HELP_SUPPORT",
        "PASSWORD_RESET",
        "EMPLOYEE_DELETE",
        "KYC",
        "CHAT_SUPPORT",
        "EMAIL_SUPPORT",
        "ENQUIRY_REQUEST",
        "CHANAGE_REPRESENTATIVE",
        "CARD_PRINTING",
        "CARD_DISPATCH",
        "EXEMPT",
      ],
    },
    superadmin_id: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);
const helpdesk = mongoose.model("hpledeskusers", helpdeskSchema);
module.exports = helpdesk;
