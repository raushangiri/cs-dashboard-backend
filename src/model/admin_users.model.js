const mongoose = require("mongoose");
const adminusersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone_no: {
      type: String,
      required: true,
    },
    country_code: {
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
    role: {
      type: String,
      enum: [
        "MANAGEMENT_ADMIN_USER",
        "SUPER_ADMIN_USER",
        "ADMIN_USER",
        "CTO_ADMIN_USER",
      ],
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    emailpassword: {
      type: String,
      //   required: true,
    },
    Is_new_user: {
      type: Boolean,
      default: true,
    },
    password: {
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
const admin_usersData = mongoose.model("admin_users", adminusersSchema);
module.exports = admin_usersData;
