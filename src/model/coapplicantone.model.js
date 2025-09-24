const mongoose = require("mongoose");
const coapplicantdata_schema = new mongoose.Schema(
  {
    file_number: {
        type: String,
      },
    coapplicant_one_type_of_loan: {
        type: String,
        default:""
    },
    coapplicant_one_loan_category: {
        type: String,
        default:""
    },
    coapplicant_one_required_amount: {
        type: String,
        default:""
    },
    coapplicant_one_mobile_number: {
        type: String,
        default:""
    },
    coapplicant_one_customerName: {
        type: String,
        default:""
    },
    coapplicant_one_name: {
        type: String,
        default:""
    },
    coapplicant_one_occupation_type: {
        type: String,
        default:""
    },
    coapplicant_one_nature_of_business: {
        type: String,
        default:""
    },
    coapplicant_one_service_type: {
        type: String,
        default:""
    },
    coapplicant_one_type_of_resident: {
        type: String,
        default:""
    },
    coapplicant_one_permanent_address: {
        type: String,
        default:""
    },
    coapplicant_one_permanent_address_landmark: {
        type: String,
        default:""
    },
    coapplicant_one_official_email_id: {
        type: String,
        default:""
    },
    coapplicant_one_personal_email_id: {
        type: String,
        default:""
    },
    coapplicant_one_office_name: {
        type: String,
        default:""
    },
    coapplicant_one_date_of_birth: {
        type: String,
        default:""
    },
    coapplicant_one_office_name: {
        type: String,
        default:""
    },
    coapplicant_one_date_of_birth: {
        type: String,
        default:""
    },
    coapplicant_one_alternate_number: {
        type: String,
        default:""
    },
    coapplicant_one_mother_name: {
        type: String,
        default:""
    },
    coapplicant_one_father_name: {
        type: String,
        default:""
    },
    coapplicant_one_marital_status: {
        type: String,
        default:""
    },
    coapplicant_one_spouse_name: {
        type: String,
        default:""
    },
    coapplicant_one_current_address: {
        type: String,
        default:""
    },
    coapplicant_one_years_at_current_residence: {
        type: String,
        default:""
    },
    coapplicant_one_total_time_in_delhi: {
        type: String,
        default:""
    },
    coapplicant_one_office_address: {
        type: String,
        default:""
    },
    coapplicant_one_office_address_landmark: {
        type: String,
        default:""
    },
    coapplicant_one_years_at_current_organization: {
        type: String,
        default:""
    },
    coapplicant_one_gst_itr_filed: {
        type: String,
        default:""
    },
    coapplicant_one_gst_and_itr_income: {
        type: String,
        default:""
    },
    coapplicant_one_inhand_salary: {
        type: String,
        default:""
    },
    coapplicant_one_other_income: {
        type: String,
        default:""
    },
    coapplicant_one_note:{
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
  const coapplicantone_details = mongoose.model("coapplicantonedetails", coapplicantdata_schema);
  module.exports = coapplicantone_details;