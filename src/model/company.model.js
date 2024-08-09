const { string } = require("joi");
const mongoose = require("mongoose");
const companySchema = new mongoose.Schema(
  {
    typeOfCompany: {
      type: String,
      required: true,
    },
    // stateOfCompany: {
    //   type: String,
    //   required: true,
    // },
    rcNumber: {
      type: String,
      required: true,
    },
    tinNumber: {
      type: String,
      required: true,
    },
    comapnyName: {
      type: String,
      required: true,
    },
    sector: {
      type: String,
      required: true,
    },
    NatureOfBusiness: {
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
    business_email: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zipcode: {
      type: String,
    },
    comapnyAddress1: {
      type: String,
      required: true,
    },
    comapnyAddress2: {
      type: String,
      // required: true
    },
    typeOfRepresentative: {
      type: String,
      required: true,
    },
    nameOfRepresentive: {
      type: String,
      required: true,
    },
    designationOfRepresentative: {
      type: String,
      required: true,
    },
    NationalIdentificationNumber: {
      type: String,
    },
    nationality: {
      type: String,
      required: true,
    },
    bankVerificationNumber: {
      type: String,
      required: true,
    },
    passportNumber: {
      type: String,
      // required: true
    },
    passportExpiry: {
      type: String,
      // required: true
    },
    cerpacNumber: {
      type: String,
      // required: true
    },
    cerpacExpiry: {
      type: String,
      // required: true
    },
    // quotaPositions: {
    //   type: Number,
    //   required: true,
    // },
    // utilizedQuota: {
    //   type: Number,
    //   required: true,
    // },
    // quota_remaining: {
    //   type: Number,
    //   required: true,
    // },
    cac: {
      type: String,
      required: true,
    },
    tcc: {
      type: String,
      // required: true,
    },
    tccnumber: {
      type: String,
      // required: true,
    },
    itf: {
      type: String,
      // required: true,
    },
    pancom: {
      type: String,
      // required: true,
    },
    letterofhead: {
      type: String,
    },
    // expatriate_quota_position: {
    //   type: String,
    //   required: true,
    // },
    additional_document: {
      type: String,
      // required: true,
    },
    save_draft: {
      type: Boolean,
      required: true,
    },
    userid: {
      type: String,
      required: true,
    },
    kyc_status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    // comapnyUuid:{
    //     type: String,
    //     required: true
    // },
    accessToken: { type: String },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);
const company = mongoose.model("company", companySchema);
module.exports = company;
