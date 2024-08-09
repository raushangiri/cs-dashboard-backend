const mongoose = require("mongoose");
const representativeSchema = new mongoose.Schema(
  {
    request_status: {
      type: Boolean,
      default: false,
    },
    request_date: {
      type: String,
      required: true,
    },
    allocation_date: {
      type: String,
      //   required: true,
    },
    type_of_representative: {
      type: String,
      required: true,
    },
    designation_of_representative: {
      type: String,
      // required: true,
    },
    name_of_representative: {
      type: String,
      // required: true,
    },
    national_identification_number: {
      type: String,
      // required: true,
    },
    nationality_of_representative: {
      type: String,
      // required: true,
    },
    bank_verification_number: {
      type: String,
      // required: true,
    },
    passport_number: {
      type: String,
      // required: true,
    },
    passport_expiry: {
      type: String,
      // required: true,
    },
    cerpac_number: {
      type: String,
      // required: true,
    },
    cerpac_expiry: {
      type: String,
      // required: true,
    },
    // password: {
    //   type: String,
    //   required: true,
    // },
    security_question1: {
      type: String,
      required: true,
    },
    security_answer1: {
      type: String,
      required: true,
    },
    security_question2: {
      type: String,
      required: true,
    },
    security_answer2: {
      type: String,
      required: true,
    },
    security_question3: {
      type: String,
      required: true,
    },
    security_answer3: {
      type: String,
      required: true,
    },
    cac_file_url: {
      type: String,
      required: true,
    },
    other_file_url: {
      type: String,
      required: true,
    },
    // mainletter: {
    //   type: String,
    //   required: true,
    // },
    new_business_email: {
      type: String,
      required: true,
    },
    old_business_email: {
      type: String,
      required: true,
    },

    country_code: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    company_id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    companyName: {
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
const representativeData = mongoose.model(
  "changerepresentative",
  representativeSchema
);
module.exports = representativeData;
