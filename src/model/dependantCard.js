const mongoose = require("mongoose");
const dependentCardscherma = new mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
    },
    employee_id: {
      type: String,
      required: true,
    },
    dependent_register_id: {
      type: String,
      required: true,
    },
    comapnyname: {
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
    dependent_card_number: {
      type: String,
      required: true,
    },
    emp_card_number: {
      type: String,
      required: true,
    },
    card_holder_name: {
      type: String,
      required: true,
    },
    mereg_no: {
      type: String,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
    // date_of_birth: {
    //     type: String,
    //     required: true
    // },
    // sex: {
    //     type: String,
    //     required: true
    // },

    relation: {
      type: String,
      default: false,
    },
    passportnumber: {
      type: String,
      // required: true
    },
    passportexpiry: {
      type: String,
      // required: true
    },
    // visatype: {
    //     type: String,
    //     required: true
    // },
    // visanumber: {
    //     type: String,
    //     required: true
    // },
    // visa_issue_date: {
    //     type: String,
    //     required: true
    // },
    // visa_expiry_date: {
    //     type: String,
    //     required: true
    // },
    card_type: {
      type: String,
      default: "dependent",
    },
    cerpac_number: {
      type: String,
      // required: true
    },
    cerpac_expiry_date: {
      type: String,
      // default: false
    },
    cerpac_issue_date: {
      type: String,
      // default: false
    },
    // dependantUuid:{
    //     type: String,
    //     // default: false
    // },
    dependant_profile_photo: {
      type: String,
      // default: false
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);
const dependant_card = mongoose.model("dependant_card", dependentCardscherma);
module.exports = dependant_card;
