const mongoose = require("mongoose");
const auto_loan_schema = new mongoose.Schema(
  {
    type_of_loan: {
        type: String,
      },	
    loan_category: {
        type: String,
      },	
    required_amount: {
        type: String,
      },	
    name: {
        type: String,
      },	
    date_of_birth: {
        type: String,
      },	
    mobile_number: {
        type: String,
      },	
    alternate_number: {
        type: String,
      },	
    mother_name: {
        type: String,
      },	
    father_name: {
        type: String,
      },	
    marital_status: {
        type: String,
      },	
    spouse_name: {
        type: String,
      },	
    current_address: {
        type: String,
      },	
    permanent_address: {
        type: String,
      },	
    permanent_address_landmark: {
        type: String,
      },	
    type_of_resident: {
        type: String,
      },	
    total_number_at_current_residence: {
        type: String,
      },	
    total_time_in_delhi: {
        type: String,
      },	
    official_email_id: {
        type: String,
      },	
    personal_email_id: {
        type: String,
      },	
    office_name: {
        type: String,
      },	
    nature_of_business: {
        type: String,
      },	
    occupation_type: {
        type: String,
      },	
    office_address: {
        type: String,
      },	
    office_address_landmark: {
        type: String,
      },	
    no_of_years_at_current_organization: {
        type: String,
      },	
    gst_itr_filed: {
        type: String,
      },	
    gst_and_itr_income: {
        type: String,
      },	
    service_type: {
        type: String,
      },	
    in_hand_salary: {
        type: String,
      },	
    other_income: {
        type: String,
      },	
    references:[
        {
            name: {
                type: String,
              },
            contact_number: {
                type: String,
              },
            address: {
                type: String,
              },
        }
    ],
    photo_document: [
      {
        document:{
        type: String
                }
      }
    ],
pan_card_document: [
    {
      document:{
      type: String
              }
    }
  ],
aadhaar_card_document: [
    {
      document:{
      type: String
              }
    }
  ],
rc_document: [
    {
      document:{
      type: String
              }
    }
  ],
insurance_document: [
    {
      document:{
      type: String
              }
    }
  ],
loan_track_document: [
    {
      document:{
      type: String
              }
    }
  ],
latest_six_months_emi_debit_banking_reqd_document: [
    {
      document:{
      type: String
              }
    }
  ],
income_docs: [
    {
      document:{
      type: String
              }
    }
  ],
e_bill_document: [
    {
      document:{
      type: String
              }
    }
  ],
  rent_agreement_with_owner_ebill: [
    {
      document:{
      type: String
              }
    }
  ],
intrested: {
    type: String,
  },
reason_of_not_intrested:{
    type:String
},
tvr_status: {
    type: String,
    default: "pending",
  },
cdr_status: {
    type: String,
    default: "pending",
  },
bank_login: {
    type: String,
    default: "pending",
  },
disbursal: {
    type: String,
    default: "pending",
  },
eligible_amount: {
    type: String,
  },
	
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);
const auto_loan = mongoose.model("auto_loan_application", auto_loan_schema);
module.exports = auto_loan;
