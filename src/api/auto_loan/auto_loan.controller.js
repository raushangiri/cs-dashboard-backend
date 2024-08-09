const auto_loan_file1 = require("../../model/auto_loan_file.model");

const createAutoLoanApplication = async (req, res) => {
  try {
    const {
      type_of_loan,
      loan_category,
      required_amount,
      name,
      date_of_birth,
      mobile_number,
      personal_email_id,
      official_email_id,
      interested,
      reason_of_not_intrested,
      // other fields...
    } = req.body;

    // Check mandatory fields
    if (!name || !mobile_number || !personal_email_id || !official_email_id || !type_of_loan || !loan_category) {
      return res.status(400).json({ message: "Mandatory fields are missing" });
    }

    // Conditional validation for interested field
    if (interested === "No" && !reason_of_not_intrested) {
      return res.status(400).json({ message: "Reason for not being interested is required when 'interested' is 'No'" });
    }

    // Create new auto loan application
    const newApplication = new auto_loan_file1({
      type_of_loan,
      loan_category,
      required_amount,
      name,
      date_of_birth,
      mobile_number,
      alternate_number: req.body.alternate_number,
      mother_name: req.body.mother_name,
      father_name: req.body.father_name,
      marital_status: req.body.marital_status,
      spouse_name: req.body.spouse_name,
      current_address: req.body.current_address,
      permanent_address: req.body.permanent_address,
      permanent_address_landmark: req.body.permanent_address_landmark,
      type_of_resident: req.body.type_of_resident,
      total_number_at_current_residence: req.body.total_number_at_current_residence,
      total_time_in_delhi: req.body.total_time_in_delhi,
      official_email_id,
      personal_email_id,
      office_name: req.body.office_name,
      nature_of_business: req.body.nature_of_business,
      occupation_type: req.body.occupation_type,
      office_address: req.body.office_address,
      office_address_landmark: req.body.office_address_landmark,
      no_of_years_at_current_organization: req.body.no_of_years_at_current_organization,
      gst_itr_filed: req.body.gst_itr_filed,
      gst_and_itr_income: req.body.gst_and_itr_income,
      service_type: req.body.service_type,
      in_hand_salary: req.body.in_hand_salary,
      other_income: req.body.other_income,
      references: req.body.references,
      photo_document: req.body.photo_document,
      pan_card_document: req.body.pan_card_document,
      aadhaar_card_document: req.body.aadhaar_card_document,
      rc_document: req.body.rc_document,
      insurance_document: req.body.insurance_document,
      loan_track_document: req.body.loan_track_document,
      latest_six_months_emi_debit_banking_reqd_document: req.body.latest_six_months_emi_debit_banking_reqd_document,
      income_docs: req.body.income_docs,
      e_bill_document: req.body.e_bill_document,
      rent_agreement_with_owner_ebill: req.body.rent_agreement_with_owner_ebill,
      interested,
      reason_of_not_intrested,
      tvr_status: req.body.tvr_status || "pending",
      cdr_status: req.body.cdr_status || "pending",
      bank_login: req.body.bank_login || "pending",
      disbursal: req.body.disbursal || "pending",
      eligible_amount: req.body.eligible_amount,
    });

    // Save the application
    await newApplication.save();
    res.status(201).json({ message: "Auto loan application submitted successfully", application: newApplication });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createAutoLoanApplication,
};