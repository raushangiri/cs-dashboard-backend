const mongoose = require("mongoose");
const agentAdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    admin_rank: {
      type: String,
      required: true,
    },
    admin_serviceNumber: {
      type: String,
      //   required: true,
    },
    phone_number: {
      type: String,
      //   required: true,
    },
    email: {
      type: String,
      required: true,
    },

    photo: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);
const agentadmin = mongoose.model("agent_admin", agentAdminSchema);
module.exports = agentadmin;
