const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema(
  {
    surname: {
      type: String,
      required: true,
    },
    userid: {
      type: String,
      required: true,
    },
    givenname: {
      type: String,
      required: true,
    },
    mereg_no: {
      type: String,
      required: true,
    },
    typeOfEmployee: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      // required: true,
    },
    countryorigin: {
      type: String,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      // required: true,
    },
    sex: {
      type: String,
      required: true,
    },
    ismarried: {
      type: String,
      required: true,
    },
    passportnumber: {
      type: String,
      // required: true
    },
    passportexpiry: {
      type: String,
      // required: true
    },
    uploadpassport: {
      type: String,
      // required: true
      default: " ",
    },
    cerpac_number: {
      type: String,
      // required: true
    },
    cerpac_expiry: {
      type: String,
      // required: true
    },
    cerpac_front: {
      type: String,
      // required: true,
      default: " ",
    },
    cerpac_back: {
      type: String,
      // required: true,
      default: " ",
    },
    visatype: {
      type: String,
      required: true,
    },
    visanumber: {
      type: String,
      // required: true,
    },
    visa_document: {
      type: String,
      // required: true,
    },
    visaexpiracydate: {
      type: String,
      // required: true,
    },
    comapnyname: {
      type: String,
      // required: true,
    },
    empnumber: {
      type: Number,
      required: true,
    },
    empcode: {
      type: Number,
      required: true,
    },
    empemail: {
      type: String,
      required: true,
    },
    empadress1: {
      type: String,
      required: true,
    },
    empaddress2: {
      type: String,
      // required: true
    },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      default: false,
    },
    city: {
      type: String,
    },
    zipcode: {
      type: String,
    },
    deleterequest: {
      type: Boolean,
      default: false,
    },
    empstatus: {
      type: Array,
      default: ["Active"],
    },
    additional_document: {
      type: String,
      default: " ",
    },

    // empUuid:{
    //     type: String,
    //     required: true
    // },
    paymentstatus: {
      type: String,
      default: "pending",
    },
    deletedocuments: {
      type: String,
    },
    employee_profile_photo: {
      type: String,
      //   required: true,
      default: " ",
    },
    emp_insertstatus: {
      type: String,
      //   required: true,
      default: " ",
    },
    position: {
      type: String,
    },
    quotaId: {
      type: String,
      // required: true,
    },
    quota_expiry: {
      type: String,
      // required: true,
    },
    kyc_status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    is_exempt: {
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
const employee = mongoose.model("employee", employeeSchema);
module.exports = employee;
