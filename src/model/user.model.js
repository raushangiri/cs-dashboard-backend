const mongoose = require("mongoose");
const userscherma = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email_address: {
      type: String,
      required: true,
    },
    loginattempt: {
      type: Number,
      default: 0,
    },
    password: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);
const user = mongoose.model("user", userscherma);
module.exports = user;
