const mongoose = require("mongoose");
const agentschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    agent_rank: {
      type: String,
      required: true,
    },
    agent_serviceNumber: {
      type: String,
      required: true,
    },
    agent_admin_id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    agent_location: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    agent_status: {
      type: String,
      enum: ["active", "inactive"],
      required: true,
      default: "active",
    },
    border_type: {
      type: String,
      required: true,
    },
    user_state: {
      type: String,
      required: true,
    },
    device_name: {
      type: String,
      required: true,
    },
    imei_number: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      // required: true,
    },
    emailpassword: {
      type: String,
      // required: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);
const agent = mongoose.model("agent", agentschema);
module.exports = agent;
