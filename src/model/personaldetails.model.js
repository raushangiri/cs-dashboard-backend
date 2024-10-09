const mongoose = require("mongoose");
const personaldata_schema = new mongoose.Schema(
  {
    file_number: {
        type: String,
      },
    is_interested: {
        type: String,
        default:""
    },
    type_of_loan: {
        type: String,
        default:""
    },
    loan_category: {
        type: String,
        default:""
    },
    required_amount: {
        type: String,
        default:""
    },
    mobile_number: {
        type: String,
        default:""
    },
    customerName: {
        type: String,
        default:""
    },
    name: {
        type: String,
        default:""
    },
    occupation_type: {
        type: String,
        default:""
    },
    nature_of_business: {
        type: String,
        default:""
    },
    service_type: {
        type: String,
        default:""
    },
    type_of_resident: {
        type: String,
        default:""
    },
    permanent_address: {
        type: String,
        default:""
    },
    permanent_address_landmark: {
        type: String,
        default:""
    },
    official_email_id: {
        type: String,
        default:""
    },
    personal_email_id: {
        type: String,
        default:""
    },
    office_name: {
        type: String,
        default:""
    },
    date_of_birth: {
        type: String,
        default:""
    },
    office_name: {
        type: String,
        default:""
    },
    date_of_birth: {
        type: String,
        default:""
    },
    alternate_number: {
        type: String,
        default:""
    },
    mother_name: {
        type: String,
        default:""
    },
    father_name: {
        type: String,
        default:""
    },
    marital_status: {
        type: String,
        default:""
    },
    spouse_name: {
        type: String,
        default:""
    },
    current_address: {
        type: String,
        default:""
    },
    years_at_current_residence: {
        type: String,
        default:""
    },
    total_time_in_delhi: {
        type: String,
        default:""
    },
    office_address: {
        type: String,
        default:""
    },
    office_address_landmark: {
        type: String,
        default:""
    },
    years_at_current_organization: {
        type: String,
        default:""
    },
    gst_itr_filed: {
        type: String,
        default:""
    },
    gst_and_itr_income: {
        type: String,
        default:""
    },
    inhand_salary: {
        type: String,
        default:""
    },
    other_income: {
        type: String,
        default:""
    },
    note:{
        type:String,
        default:""
    }
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }


);
  const personal_details = mongoose.model("loan_file_personaldetails", personaldata_schema);
  module.exports = personal_details;