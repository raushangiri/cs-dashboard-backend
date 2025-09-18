const mongoose = require("mongoose");

const userschema = new mongoose.Schema(
  {
    userId: {
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
    reportingTo: {
      type: String,
      default: null, // Default to null if not provided
    },
    department: {
      type: [String], // Store department as an array of strings to handle multiple departments
      default: [], // Default to an empty array if not provided
    },
    password: {
      type: String,
      required: true,
    },
    hasChangedPassword: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: { 
      type: Date, 
      default: null 
    }
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

const user = mongoose.model("user", userschema);
module.exports = user;
