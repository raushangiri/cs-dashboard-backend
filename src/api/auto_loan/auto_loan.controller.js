const auto_loan_file = require("../../model/auto_loan_file.model");
const uploadDatamodel = require("../../model/uploadData.model");
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

const uploadData = async (req, res) => {
  try {
    const data = req.body;

    // Validate and transform data if needed
    const transformedData = data.map((item) => ({
      customerName: item["Customer Name"],
      customerNumber: item["Customer Number"],
      productName: item["Product Name"],
      permanentAddress: item["Permanent address"],
      location: item["Location"],
      companyName: item["Company Name"],
      salary: item["Salary"],
      selfEmployee: item["Self Employee"],
      companyNumber: item["Company Number"],
      companyAddress: item["Company Address"],
      emailId: item["Email Id"],
      bankName: item["Bank Name"],
      tenure: item["tenure"],
      loanAmount: item["Loan Amount"],
      carName: item["Car Name"],
      carDetails: item["Car Details"],
      model: item["Modal"],
      carNumber: item["Car Number"],
      insurance: item["Insurance"],
      // Ensure fields are included in the transformed data if necessary
    }));

    // Insert many documents to the database
    await auto_loan_file.insertMany(transformedData);
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
  const { customerNumber } = req.query;
// console.log(customerNumber)
  if (!customerNumber) {
    return res.status(400).json({ message: 'Customer number is required.' });
  }

  try {
    const customerDetails = await auto_loan_file.findOne({ customerNumber });

    if (!customerDetails) {
      return res.status(404).json({ message: 'Customer not found.' });
    }

    res.status(200).json(customerDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve customer details.' });
  }
};

module.exports = {
  createAutoLoanApplication,
  uploadData,
  getfiledata
};