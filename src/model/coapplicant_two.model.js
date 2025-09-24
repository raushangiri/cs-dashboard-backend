const mongoose = require("mongoose");
const coapplicantdata_schema = new mongoose.Schema(
  {
 file_number: {
    type: String,
  },
  coapplicant_two_type_of_loan: {
    type: String,
    default: ""
  },
  coapplicant_two_loan_category: {
    type: String,
    default: ""
  },
  coapplicant_two_required_amount: {
    type: String,
    default: ""
  },
  coapplicant_two_mobile_number: {
    type: String,
    default: ""
  },
  coapplicant_two_customerName: {
    type: String,
    default: ""
  },
  coapplicant_two_name: {
    type: String,
    default: ""
  },
  coapplicant_two_occupation_type: {
    type: String,
    default: ""
  },
  coapplicant_two_nature_of_business: {
    type: String,
    default: ""
  },
  coapplicant_two_service_type: {
    type: String,
    default: ""
  },
  coapplicant_two_type_of_resident: {
    type: String,
    default: ""
  },
  coapplicant_two_permanent_address: {
    type: String,
    default: ""
  },
  coapplicant_two_permanent_address_landmark: {
    type: String,
    default: ""
  },
  coapplicant_two_official_email_id: {
    type: String,
    default: ""
  },
  coapplicant_two_personal_email_id: {
    type: String,
    default: ""
  },
  coapplicant_two_office_name: {
    type: String,
    default: ""
  },
  coapplicant_two_date_of_birth: {
    type: String,
    default: ""
  },
  coapplicant_two_alternate_number: {
    type: String,
    default: ""
  },
  coapplicant_two_mother_name: {
    type: String,
    default: ""
  },
  coapplicant_two_father_name: {
    type: String,
    default: ""
  },
  coapplicant_two_marital_status: {
    type: String,
    default: ""
  },
  coapplicant_two_spouse_name: {
    type: String,
    default: ""
  },
  coapplicant_two_current_address: {
    type: String,
    default: ""
  },
  coapplicant_two_years_at_current_residence: {
    type: String,
    default: ""
  },
  coapplicant_two_total_time_in_delhi: {
    type: String,
    default: ""
  },
  coapplicant_two_office_address: {
    type: String,
    default: ""
  },
  coapplicant_two_office_address_landmark: {
    type: String,
    default: ""
  },
  coapplicant_two_years_at_current_organization: {
    type: String,
    default: ""
  },
  coapplicant_two_gst_itr_filed: {
    type: String,
    default: ""
  },
  coapplicant_two_gst_and_itr_income: {
    type: String,
    default: ""
  },
  coapplicant_two_inhand_salary: {
    type: String,
    default: ""
  },
  coapplicant_two_other_income: {
    type: String,
    default: ""
  },
  coapplicant_two_note: {
    type: String,
    default: ""
  }

  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }


);
  const coapplicanttwo_details = mongoose.model("coapplicanttwodetails", coapplicantdata_schema);
  module.exports = coapplicanttwo_details;