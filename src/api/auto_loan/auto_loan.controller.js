const auto_loan_file = require("../../model/auto_loan_file.model");
const uploadDatamodel = require("../../model/uploadData.model");
const overview_details = require('../../model/overview.model');  // Your model
const personal_details_model = require('../../model/personaldetails.model');  // Your model
const reference_details = require('../../model/Reference.model');  // Your model



const processAndSaveAutoLoanApplication = async (data) => {
  try {
    const {
      customerName,
      customerNumber,
      productName,
      permanentAddress,
      location,
      companyName,
      salary,
      selfEmployee,
      companyNumber,
      companyAddress,
      emailId,
      bankName,
      tenure,
      loanAmount,
      carName,
      model,
      carNumber,
      insurance,
      name,
      dateOfBirth,
      mobileNumber,
      alternateNumber,
      motherName,
      fatherName,
      maritalStatus,
      spouseName,
      currentAddress,
      permanentAddressLandmark,
      typeOfResident,
      totalNumberAtCurrentResidence,
      totalTimeInDelhi,
      officialEmailId,
      personalEmailId,
      occupationType,
      natureOfBusiness,
      serviceType,
      officeName,
      officeAddress,
      officeAddressLandmark,
      noOfYearsAtCurrentOrganization,
      gstItrFiled,
      gstAndItrIncome,
      inHandSalary,
      otherIncome,
      references,
      photoDocument,
      panCardDocument,
      aadhaarCardDocument,
      rcDocument,
      insuranceDocument,
      loanTrackDocument,
      latestSixMonthsEmiDebitBankingReqdDocument,
      incomeDocs,
      eBillDocument,
      rentAgreementWithOwnerEbill,
      interested,
      reasonOfNotInterested,
      tvrStatus = "pending",
      cdrStatus = "pending",
      bankLogin = "pending",
      disbursal = "pending",
      eligibleAmount
    } = data;

    // Check mandatory fields
    if (!name || !mobileNumber || !personalEmailId || !officialEmailId || !loanAmount || !tenure) {
      throw new Error("Mandatory fields are missing");
    }

    // Conditional validation for interested field
    if (interested === "No" && !reasonOfNotInterested) {
      throw new Error("Reason for not being interested is required when 'interested' is 'No'");
    }

    // Create new auto loan application
    const newApplication = new auto_loan_file({
      customerName,
      customerNumber,
      productName,
      permanentAddress,
      location,
      companyName,
      salary,
      selfEmployee,
      companyNumber,
      companyAddress,
      emailId,
      bankName,
      tenure,
      loanAmount,
      carName,
      model,
      carNumber,
      insurance,
      name,
      dateOfBirth,
      mobileNumber,
      alternateNumber,
      motherName,
      fatherName,
      maritalStatus,
      spouseName,
      currentAddress,
      permanentAddressLandmark,
      typeOfResident,
      totalNumberAtCurrentResidence,
      totalTimeInDelhi,
      officialEmailId,
      personalEmailId,
      occupationType,
      natureOfBusiness,
      serviceType,
      officeName,
      officeAddress,
      officeAddressLandmark,
      noOfYearsAtCurrentOrganization,
      gstItrFiled,
      gstAndItrIncome,
      inHandSalary,
      otherIncome,
      references,
      photoDocument,
      panCardDocument,
      aadhaarCardDocument,
      rcDocument,
      insuranceDocument,
      loanTrackDocument,
      latestSixMonthsEmiDebitBankingReqdDocument,
      incomeDocs,
      eBillDocument,
      rentAgreementWithOwnerEbill,
      interested,
      reasonOfNotInterested,
      tvrStatus,
      cdrStatus,
      bankLogin,
      disbursal,
      eligibleAmount
    });

    // Save the application
    await newApplication.save();
    return { status: 201, message: "Auto loan application submitted successfully", application: newApplication };
  } catch (error) {
    throw new Error(`Server error: ${error.message}`);
  }
};

const createAutoLoanApplication = async (req, res) => {
  try {
    const result = await processAndSaveAutoLoanApplication(req.body);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// const createAutoLoanApplication = async (req, res) => {
//   try {
//     // Destructure fields from request body
//     const {
//       customerName,
//       customerNumber,
//       productName,
//       permanentAddress,
//       location,
//       companyName,
//       salary,
//       selfEmployee,
//       companyNumber,
//       companyAddress,
//       emailId,
//       bankName,
//       tenure,
//       loanAmount,
//       carName,
//       model,
//       carNumber,
//       insurance,
//       name,
//       dateOfBirth,
//       mobileNumber,
//       alternateNumber,
//       motherName,
//       fatherName,
//       maritalStatus,
//       spouseName,
//       currentAddress,
//       permanentAddressLandmark,
//       typeOfResident,
//       totalNumberAtCurrentResidence,
//       totalTimeInDelhi,
//       officialEmailId,
//       personalEmailId,
//       occupationType,
//       natureOfBusiness,
//       serviceType,
//       officeName,
//       officeAddress,
//       officeAddressLandmark,
//       noOfYearsAtCurrentOrganization,
//       gstItrFiled,
//       gstAndItrIncome,
//       inHandSalary,
//       otherIncome,
//       references,
//       photoDocument,
//       panCardDocument,
//       aadhaarCardDocument,
//       rcDocument,
//       insuranceDocument,
//       loanTrackDocument,
//       latestSixMonthsEmiDebitBankingReqdDocument,
//       incomeDocs,
//       eBillDocument,
//       rentAgreementWithOwnerEbill,
//       interested,
//       reasonOfNotInterested,
//       tvrStatus = "pending",
//       cdrStatus = "pending",
//       bankLogin = "pending",
//       disbursal = "pending",
//       eligibleAmount
//     } = req.body;

//     // Check mandatory fields
//     if (!name || !mobileNumber || !personalEmailId || !officialEmailId || !loanAmount || !tenure) {
//       return res.status(400).json({ message: "Mandatory fields are missing" });
//     }

//     // Conditional validation for interested field
//     if (interested === "No" && !reasonOfNotInterested) {
//       return res.status(400).json({ message: "Reason for not being interested is required when 'interested' is 'No'" });
//     }

//     // Create new auto loan application
//     const newApplication = new auto_loan_file1({
//       customerName,
//       customerNumber,
//       productName,
//       permanentAddress,
//       location,
//       companyName,
//       salary,
//       selfEmployee,
//       companyNumber,
//       companyAddress,
//       emailId,
//       bankName,
//       tenure,
//       loanAmount,
//       carName,
//       model,
//       carNumber,
//       insurance,
//       name,
//       dateOfBirth,
//       mobileNumber,
//       alternateNumber,
//       motherName,
//       fatherName,
//       maritalStatus,
//       spouseName,
//       currentAddress,
//       permanentAddressLandmark,
//       typeOfResident,
//       totalNumberAtCurrentResidence,
//       totalTimeInDelhi,
//       officialEmailId,
//       personalEmailId,
//       occupationType,
//       natureOfBusiness,
//       serviceType,
//       officeName,
//       officeAddress,
//       officeAddressLandmark,
//       noOfYearsAtCurrentOrganization,
//       gstItrFiled,
//       gstAndItrIncome,
//       inHandSalary,
//       otherIncome,
//       references,
//       photoDocument,
//       panCardDocument,
//       aadhaarCardDocument,
//       rcDocument,
//       insuranceDocument,
//       loanTrackDocument,
//       latestSixMonthsEmiDebitBankingReqdDocument,
//       incomeDocs,
//       eBillDocument,
//       rentAgreementWithOwnerEbill,
//       interested,
//       reasonOfNotInterested,
//       tvrStatus,
//       cdrStatus,
//       bankLogin,
//       disbursal,
//       eligibleAmount
//     });

//     // Save the application
//     await newApplication.save();
//     res.status(201).json({ message: "Auto loan application submitted successfully", application: newApplication });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

const generateFileNumber = async () => {
  let fileNumber;
  let exists = true;

  while (exists) {
    // Generate a 5-digit random number
    fileNumber = Math.floor(10000 + Math.random() * 90000).toString(); // Ensures a 5-digit number

    // Check if this file number already exists
    const fileExists = await auto_loan_file.findOne({ file_number: fileNumber });
    if (!fileExists) {
      exists = false; // If no file exists with this number, exit the loop
    }
  }
  
  return fileNumber;
};

const uploadData = async (req, res) => {
  try {
    const data = req.body;

    // Transform and validate data
    const transformedData = await Promise.all(data.map(async (item) => {
      // Generate a unique 5-digit file number for each entry
      const fileNumber = await generateFileNumber();

      return {
        file_number: fileNumber, // Unique 5-digit file number
        mobile_number: item["Customer Number"],
        previous_loan_bank_name: item["Bank Name"],
        previous_product_model: item["Product Name"],
        previous_loan_sanction_date: item["Loan Sanction Date"], // Assuming you have this field
        customer_name: item["Customer Name"],
        previous_loan_type: item["Loan Type"], // Assuming Loan Type field
        previous_loan_amount: item["Loan Amount"],
        previous_loan_insurance_value: item["Insurance"],
        // Additional fields from your original data
        permanentAddress: item["Permanent address"],
        location: item["Location"],
        companyName: item["Company Name"],
        salary: item["Salary"],
        selfEmployee: item["Self Employee"],
        companyNumber: item["Company Number"],
        companyAddress: item["Company Address"],
        emailId: item["Email Id"],
        tenure: item["tenure"],
        carName: item["Car Name"],
        carDetails: item["Car Details"],
        model: item["Modal"],
        carNumber: item["Car Number"],
        // Ensure all necessary fields are included in the transformation
      };
    }));

    // Insert many documents into the database
    await overview_details.insertMany(transformedData);
    res.status(200).json({ message: 'Data stored successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to store data.' });
  }
};


// const uploadData= async (req, res) => {
//   try {
//     const data = req.body;

//     // Validate and transform data if needed
//     const transformedData = data.map((item) => ({
//       customerName: item["Customer Name"],
//       customerNumber: item["Customer Number"],
//       productName: item["Product Name"],
//       permanentAddress: item["Permanent address"],
//       location: item["Location"],
//       companyName: item["Company Name"],
//       salary: item["Salary"],
//       selfEmployee: item["Self Employee"],
//       companyNumber: item["Company Number"],
//       companyAddress: item["Company Address"],
//       emailId: item["Email Id"],
//       bankName: item["Bank Name"],
//       tenure: item["tenure"],
//       loanAmount: item["Loan Amount"],
//       carName: item["Car Name"],
//       model: item["Modal"],
//       carNumber: item["Car Number"],
//       insurance: item["Insurance"],
//     }));

//     // Save to database
//     await uploadDatamodel.insertMany(transformedData);
//     res.status(200).json({ message: 'Data stored successfully!' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to store data.' });
//   }
// };

const getfiledata= async (req, res) => {
  const { mobile_number } = req.params;
  if (!mobile_number) {
    return res.status(400).json({ message: 'Customer number is required.' });
  }

  try {
    const customerDetails = await overview_details.findOne({ mobile_number });

    if (!customerDetails) {
      return res.status(404).json({ message: 'Customer not found.' });
    }

    res.status(200).json(customerDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve customer details.' });
  }
};

// API function to create new loan file overview
const createLoanFileOverview = async (req, res) => {
  try {
    // Generate a unique file number
    const fileNumber = await generateFileNumber();

    // Create new overview entry
    const newOverview = new overview_details({
      file_number: fileNumber,
      mobile_number: req.body.mobile_number,
      previous_loan_bank_name: req.body.previous_loan_bank_name,
      previous_product_model: req.body.previous_product_model,
      previous_loan_sanction_date: req.body.previous_loan_sanction_date,
      customer_name: req.body.customer_name,
      previous_loan_type: req.body.previous_loan_type,
      previous_loan_amount: req.body.previous_loan_amount,
      previous_loan_insurance_value: req.body.previous_loan_insurance_value,
    });

    // Save the new loan file overview document to the database
    await newOverview.save();

    // Send response back to client
    return res.status(201).json({
      success: true,
      message: "Loan file overview created successfully",
      data: newOverview,
    });
  } catch (error) {
    console.error('Error creating loan file overview:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};


const createpersonadetails = async (req, res) => {
  const { file_number } = req.params;
  const {
    is_interested,
    type_of_loan,
    loan_category,
    required_amount,
    mobile_number,
    name,
    occupation_type,
    nature_of_business,
    service_type,
    type_of_resident,
    permanent_address,
    permanent_address_landmark,
    official_email_id,
    personal_email_id,
    office_name,
    date_of_birth,
    alternate_number,
    mother_name,
    father_name,
    marital_status,
    spouse_name,
    current_address,
    years_at_current_residence,
    total_time_in_delhi,
    office_address,
    office_address_landmark,
    years_at_current_organization,
    gst_itr_filed,
    gst_and_itr_income,
    inhand_salary,
    other_income,
  } = req.body;

  try {
    // Check if a personal details document with the given file_number already exists
    const updatedPersonalDetails = await personal_details_model.findOneAndUpdate(
      { file_number },  // Search criteria
      {
        $set: {
          is_interested,
          type_of_loan,
          loan_category,
          required_amount,
          mobile_number,
          name,
          occupation_type,
          nature_of_business,
          service_type,
          type_of_resident,
          permanent_address,
          permanent_address_landmark,
          official_email_id,
          personal_email_id,
          office_name,
          date_of_birth,
          alternate_number,
          mother_name,
          father_name,
          marital_status,
          spouse_name,
          current_address,
          years_at_current_residence,
          total_time_in_delhi,
          office_address,
          office_address_landmark,
          years_at_current_organization,
          gst_itr_filed,
          gst_and_itr_income,
          inhand_salary,
          other_income,
        }
      },
      { new: true, upsert: true }  // Options: new returns the updated document, upsert creates if not found
    );

    // Respond with success
    if (updatedPersonalDetails) {
      res.status(200).json({ message: 'details updated successfully'});
    }
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: 'Error saving personal details', error: error.message });
  }
};


const getpersonadetails=async (req, res) => {
  const { file_number } = req.params;

  try {
    const details = await personal_details_model.findOne({ file_number });

    if (!details) {
      return res.status(404).json({ message: 'Personal details not found' });
    }

    res.status(200).json({ data: details });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving personal details', error: error.message });
  }
};


const createreferencedetail = async (req, res) => {
  const { file_number } = req.params;
  const {
    
    reference_name,
    reference_mobile_number,
    occupation_type,
    nature_of_business,
    company_name,
    reference_address,
    
  } = req.body;

  try {
    // Check if a personal details document with the given file_number already exists
    const updatedReferenceDetails = await reference_details.findOneAndUpdate(
      { file_number },  // Search criteria
      {
        $set: {
          file_number,
reference_name,
reference_mobile_number,
occupation_type,
nature_of_business,
company_name,
reference_address,

        }
      },
      { new: true, upsert: true }  // Options: new returns the updated document, upsert creates if not found
    );

    // Respond with success
    if (updatedReferenceDetails) {
      res.status(200).json({ message: 'reference details updated successfully'});
    }
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: 'Error saving personal details', error: error.message });
  }
};

const getreferencedetail=async (req, res) => {
  const { file_number } = req.params;

  try {
    const details = await reference_details.findOne({ file_number });

    if (!details) {
      return res.status(404).json({ message: 'reference details not found' });
    }

    res.status(200).json({ data: details });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving reference details', error: error.message });
  }
};


module.exports = {
  createAutoLoanApplication,
  uploadData,
  getfiledata,
  createLoanFileOverview,
  createpersonadetails,
  getpersonadetails,
  createreferencedetail,
  getreferencedetail
};