const { string } = require("joi");
const mongoose = require("mongoose");
const cardSchema = new mongoose.Schema();
const cardmodel = {
  registration_Object_id: {
    type: String,
    required: true,
  },
  emp_registration_id: {
    type: String,
    required: true,
  },
  emp_profile_photo: {
    type: String,
  },
  company_name: {
    type: String,
    required: true,
  },
  card_issue_date: {
    type: String,
    required: true,
  },
  card_expiry_date: {
    type: String,
    required: true,
  },
  quota_expiry_date: {
    type: String,
    required: true,
  },
  mereg_no: {
    type: String,
    required: true,
  },
  card_number: {
    type: String,
    required: true,
  },
  card_holder_name: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  passport_number: {
    type: String,
    required: true,
  },
  cerpac_number: {
    type: String,
    // required: true,
  },
  cerpac_validity: {
    type: String,
    // required: true,
  },
  passport_validaity: {
    type: String,
    required: true,
  },
  card_type: {
    type: String,
    default: "primary",
  },
  designation: {
    type: String,
    required: true,
  },
  request_status: {
    type: String,
    default: "pending",
    enums: ["pending", "dispatch", "completed", "printing"],
  },
  card_status: {
    type: String,
    default: "pending",
    enums: ["pending", "dispatch", "completed", "printing"],
  },
  agent_id: {
    type: String,
  },
  allocation_date: {
    type: String,
  },
};
const card = mongoose.model("card", cardmodel);
module.exports = card;
