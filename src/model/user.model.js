const mongoose = require("mongoose");
const userscherma = new mongoose.Schema(
  {
    userId:{
      type: String,
    },
    role: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    hasChangedPassword: 
    { 
      type: Boolean, 
      default: false 
    },
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
