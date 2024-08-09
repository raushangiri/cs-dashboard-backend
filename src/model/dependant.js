const mongoose = require("mongoose");
const dependentSchema = new mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
    },
    employee_id: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    given_name: {
      type: String,
      required: true,
    },
    comapnyname: {
      type: String,
      // required: true,
    },
    mereg_no: {
      type: String,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
    date_of_birth: {
      type: String,
      required: true,
    },
    sex: {
      type: String,
      required: true,
    },
    passport_photo: {
      type: String,
      required: true,
    },
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
    //   type: String,
    //   required: true,
    // },
    // visanumber: {
    //   type: String,
    //   // required: true,
    // },
    accompanyWith: {
      type: String,
      required: true,
    },
    // visa_issue_date: {
    //   type: String,
    //   required: true,
    // },
    // visa_expiry_date: {
    //   type: String,
    //   // required: true,
    // },
    cerpac_number: {
      type: String,
      // required: true
    },
    cerpac_expiry_date: {
      type: String,
      //   // default: false
    },
    // cerpac_issue_date: {
    //   type: String,
    //   // default: false
    // },
    // dependantUuid:{
    //     type: String,
    //     // default: false
    // },
    dependant_profile_photo: {
      type: String,
      required: true,
    },
    card_generated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

const dependent = mongoose.model("dependent", dependentSchema);
module.exports = dependent;
