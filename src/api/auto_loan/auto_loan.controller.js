const auto_loan_file = require("../../model/auto_loan_file.model");
const uploadDatamodel = require("../../model/uploadData.model");
const overview_details = require('../../model/overview.model');  // Your model
const personal_details_model = require('../../model/personaldetails.model');  // Your model
const reference_details = require('../../model/Reference.model');  // Your model
const dispositionmodel = require("../../model/desposition.model");
const user = require("../../model/user.model");
const mongoose = require('mongoose'); // Ensure mongoose is imported
const LoandataModel = require("../../model/loandata.model");
const loanfilemodel = require('../../model/loan_file.model'); // Assuming your model is in the same folder
const attachmentmodel = require('../../model/attachment.model'); // Assuming your model is in the same folder
const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const upload = multer({ dest: 'uploads/' }); // Store uploaded files in 'uploads/' folder
const app = express();
const moment = require('moment');
const BankStatementmodel = require('../../model/bankStatement.model');
const bankStatementModel = require("../../model/bankStatement.model");
const BankDetail = require("../../model/banklogin.model");

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

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ error: 'No data received' });
    }

    // Helper function to generate a unique 5-digit file number
    const generateFileNumber = async () => {
      let fileNumber;
      let exists = true;

      while (exists) {
        // Generate a 5-digit random number
        fileNumber = Math.floor(10000 + Math.random() * 90000).toString(); // Ensures a 5-digit number

        // Check if this file number already exists
        const fileExists = await overview_details.findOne({ file_number: fileNumber });
        if (!fileExists) {
          exists = false; // If no file exists with this number, exit the loop
        }
      }

      return fileNumber;
    };

    // Prepare data for database insertion with shared fileNumber
    const overviewDocs = await Promise.all(data.map(async (item) => {
      const fileNumber = await generateFileNumber(); // Generate unique file number for each record

      return {
        mobile_number: item["Customer Number"],
        previous_loan_bank_name: item["Bank Name"],
        previous_product_model: item["Product Name"],
        previous_loan_sanction_date: item["Loan Sanction Date"],
        customer_name: item["Customer Name"],
        previous_loan_type: item["Loan Type"],
        previous_loan_amount: item["Loan Amount"],
        previous_loan_insurance_value: item["Loan Insurance Value"],
        previous_loan_insurance_bank_name: item["Loan Insurance Bank Name"],
        permanentAddress: item["Permanent address"],
        location: item["Location"],
        city: item["City"],
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
        file_number: fileNumber // Attach generated file number
      };
    }));

    // Prepare data for the file status collection, reusing the same file numbers
    const fileStatusDoc = overviewDocs.map((item) => ({
      file_number: item.file_number, // Reuse the same file_number
      customer_name: item.customer_name,
      customer_mobile_number: item.mobile_number,
    }));

    // Bulk insert into the collections
    await overview_details.insertMany(overviewDocs);
    await loanfilemodel.insertMany(fileStatusDoc);

    res.status(200).json({ message: 'Data successfully saved with unique file numbers' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while saving the data' });
  }
};

// const uploadData = async (req, res) => {
//   const session = await mongoose.startSession(); // Start MongoDB session for transactions
//   session.startTransaction(); // Begin a transaction

//   try {
//     const data = req.body; // Receive the data from the request body

//     // Validate the data format
//     if (!Array.isArray(data) || data.length === 0) {
//       return res.status(400).json({ message: 'Invalid data format. Expecting an array of objects.' });
//     }

//     // Prepare documents for batch insert
//     const overviewDocs = [];
//     const fileStatusDocs = [];

//     for (let item of data) {
//       // Check if required fields are present
//       if (!item["Customer Name"] || !item["Customer Number"]) {
//         console.warn(`Skipping item due to missing required fields: ${JSON.stringify(item)}`);
//         continue; // Skip this item if it doesn't have required fields
//       }

//       const fileNumber = await generateFileNumber(); // Generate unique file number

//       const overviewDoc = {
//         file_number: fileNumber,
//         mobile_number: item["Customer Number"],
//         previous_loan_bank_name: item["Bank Name"] || null,
//         previous_product_model: item["Product Name"] || null,
//         previous_loan_sanction_date: item["Loan Sanction Date"] || null,
//         customer_name: item["Customer Name"],
//         previous_loan_type: item["Loan Type"] || null,
//         previous_loan_amount: item["Loan Amount"] || null,
//         previous_loan_insurance_value: item["Loan Insurance Value"] || null,
//         previous_loan_insurance_bank_name: item["Loan Insurance Bank Name"] || null,
//         permanentAddress: item["Permanent address"] || null,
//         location: item["Location"] || null,
//         city: item["City"] || null,
//         companyName: item["Company Name"] || null,
//         salary: item["Salary"] || null,
//         selfEmployee: item["Self Employee"] || null,
//         companyNumber: item["Company Number"] || null,
//         companyAddress: item["Company Address"] || null,
//         emailId: item["Email Id"] || null,
//         tenure: item["tenure"] || null,
//         carName: item["Car Name"] || null,
//         carDetails: item["Car Details"] || null,
//         model: item["Modal"] || null,
//         carNumber: item["Car Number"] || null,
//       };

//       const fileStatusDoc = {
//         file_number: fileNumber,
//         customer_name: item["Customer Name"],
//         customer_mobile_number: item["Customer Number"],
//         // Add default values for other fields if necessary
//       };

//       // Push to arrays
//       overviewDocs.push(overviewDoc);
//       fileStatusDocs.push(fileStatusDoc);
//     }

//      await Promise.all([
//             overview_details.insertMany(overviewDocs, { session }),
//             loanfilemodel.insertMany(fileStatusDocs, { session }),
//         ]);

//         await session.commitTransaction();
//         res.status(200).json({ message: 'Data stored successfully!' });
//     } catch (error) {
//         console.error('Error in processing data:', error);
//         await session.abortTransaction();
//         res.status(500).json({ message: 'Failed to store data.' });
//     } finally {
//         session.endSession();
//     }
// };


const getfiledata = async (req, res) => {
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
    customerName,
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
    note
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
          customerName,
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
          note
        }
      },
      { new: true, upsert: true }  // Options: new returns the updated document, upsert creates if not found
    );

    // Respond with success
    if (updatedPersonalDetails) {
      res.status(200).json({ message: 'details updated successfully' });
    }
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: 'Error saving personal details', error: error.message });
  }
};

const getpersonadetails = async (req, res) => {
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
    reference_occupation_type,
    reference_nature_of_business,
    company_name,
    reference_address,
  } = req.body;

  try {
    // // Check if a reference detail with the given file_number already exists
    // const existingReferenceDetail = await reference_details.findOne({ file_number });

    // if (existingReferenceDetail) {
    //   return res.status(400).json({
    //     message: 'Reference detail with this file_number already exists',
    //   });
    // }

    // Create a new reference detail
    const newReferenceDetail = await reference_details.create({
      file_number,
      reference_name,
      reference_mobile_number,
      reference_occupation_type,
      reference_nature_of_business,
      company_name,
      reference_address,
    });

    // Respond with success
    res.status(201).json({
      message: 'Reference detail created successfully',
      data: newReferenceDetail,
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({
      message: 'Error creating reference detail',
      error: error.message,
    });
  }
};

const deletereferencedetail = async (req, res) => {
  const { _id } = req.params; // Assuming the reference ID is passed in the URL as a parameter

  try {
    // Find the reference detail by its ID and delete it
    const deletedReferenceDetail = await reference_details.findByIdAndDelete(_id);

    // If the reference detail doesn't exist
    if (!deletedReferenceDetail) {
      return res.status(404).json({
        message: 'Reference detail not found',
      });
    }

    // Respond with success if the deletion was successful
    res.status(200).json({
      message: 'Reference detail deleted successfully',
      data: deletedReferenceDetail, // Returning the deleted reference data (optional)
    });
  } catch (error) {
    // Handle any errors during deletion
    res.status(500).json({
      message: 'Error deleting reference detail',
      error: error.message,
    });
  }
};


const updatereferencedetail = async (req, res) => {
  const { id } = req.params; // Get the reference ID from the URL parameters
  const {
    reference_name,
    reference_mobile_number,
    reference_occupation_type,
    reference_nature_of_business,
    company_name,
    reference_address,
  } = req.body;

  try {
    // Find the reference detail by ID
    const existingReferenceDetail = await reference_details.findById(id);

    // Check if the reference detail exists
    if (!existingReferenceDetail) {
      return res.status(404).json({
        message: 'Reference detail not found',
      });
    }

    // Update the reference detail with the new data
    existingReferenceDetail.reference_name = reference_name;
    existingReferenceDetail.reference_mobile_number = reference_mobile_number;
    existingReferenceDetail.reference_occupation_type = reference_occupation_type;
    existingReferenceDetail.reference_nature_of_business = reference_nature_of_business;
    existingReferenceDetail.company_name = company_name;
    existingReferenceDetail.reference_address = reference_address;

    // Save the updated reference detail
    const updatedReferenceDetail = await existingReferenceDetail.save();

    // Respond with success
    res.status(200).json({
      message: 'Reference detail updated successfully',
      data: updatedReferenceDetail,
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({
      message: 'Error updating reference detail',
      error: error.message,
    });
  }
};


const getreferencedetail = async (req, res) => {
  const { file_number } = req.params;

  try {
    const details = await reference_details.find({ file_number });

    if (!details) {
      return res.status(404).json({ message: 'reference details not found' });
    }

    res.status(200).json({ data: details });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving reference details', error: error.message });
  }
};

const createdesposition = async (req, res) => {
  const {
    userId,
    role,
    call_status,
    is_interested,
    disposition,
    selected_documents,
    expected_document_date,
    not_interested_reason,
    remarks,
    file_status,
    file_number,
    type_of_loan
  } = req.body;

  // console.log(file_status,"file_status")
  try {
    const userdetails = await user.findOne({ userId });
    if (!userdetails) {
      return res.status(404).json({ message: 'User not found' });
    }
    const newDisposition = new dispositionmodel({
      userId,
      username: userdetails.name,
      role,
      department: "test",
      call_status,
      is_interested,
      disposition,
      selected_documents,
      expected_document_date,
      not_interested_reason,
      remarks,
      file_status,
      file_number,
      type_of_loan
    });

    await newDisposition.save();
    const loanFile = await loanfilemodel.findOne({ file_number });


    if (!loanFile) {
      return res.status(404).json({ message: 'File not found' });
    }
    let updateData = {};
    let updateNeeded = false;

    

    switch (role) {
      case 'sales':
        // if (!loanFile.sales_agent_id.trim() && is_interested === 'Interested') {
        //   updateData.sales_agent_id = userId;
        //   updateData.sales_status = is_interested;
        //   updateData.file_status = file_status;
        //   updateData.sales_agent_name = userdetails.name
        //   updateData.sales_assign_date = new Date();
        //   updateNeeded = true;
        // }
        if (is_interested === 'Interested') {
          const fifteenDaysAgo = new Date();
          fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
        
          // Check if sales_agent_id is empty and interest is marked as 'Interested'
          if (!loanFile.sales_agent_id.trim()) {
            updateData.sales_agent_id = userId;
            updateData.sales_status = is_interested;
            updateData.file_status = file_status;
            updateData.sales_agent_name = userdetails.name;
            updateData.sales_assign_date = new Date();
            updateNeeded = true;
          }
          // Check if sales_assign_date is more than 15 days ago
          else if (loanFile.sales_assign_date && loanFile.sales_assign_date < fifteenDaysAgo) {
            updateData.sales_agent_name = userdetails.name;
            updateData.sales_assign_date = new Date();
            updateData.sales_agent_id = userId;
            updateNeeded = true;
          }
        }
        
        else {
          updateData.file_status = file_status;
          updateNeeded = true;
        }
        if (file_status === 'process_to_tvr') {
          updateData.tvr_status = 'Pending';
          updateNeeded = true;
          updateData.tvr_assign_date = new Date();
        }
        break;
      case 'TVR':
        if (!loanFile.tvr_agent_id.trim()) {
          updateData.tvr_agent_id = userId;
          updateData.tvr_agent_name = userdetails.name
          updateData.file_status = file_status;
          updateNeeded = true;
        } else {
          updateData.file_status = file_status;
          updateNeeded = true;
        }
        if (file_status === 'process_to_cdr') {
          updateData.cdr_status = 'Pending';
          updateData.cdr_assign_date = new Date();
          updateData.tvr_status = 'Completed';
          updateData.tvr_action_date=new Date();
          updateNeeded = true;
        }
        if (file_status === 'tvr_rejected') {
          updateData.tvr_status = 'Rejected';
          updateData.tvr_action_date=new Date();

          updateNeeded = true;
        }
        
        break;
      case 'CDR':
        if (!loanFile.cdr_agent_id.trim()) {
          updateData.cdr_agent_id = userId;
          updateData.cdr_agent_name = userdetails.name

          updateData.file_status = file_status;

          updateNeeded = true;
        } else {
          // updateData.file_status = file_status;
          updateNeeded = true;
        }
        if (file_status === 'process_to_login_team') {
          updateData.banklogin_status = 'Pending';
          updateData.banklogin_assign_date = new Date();
          updateData.cdr_action_date = new Date();
          updateData.cdr_status = 'Completed';
          updateNeeded = true;
        }
        if (file_status === 'cdr_rejected') {
          updateData.cdr_status = 'Rejected';
          updateData.cdr_action_date = new Date();
          updateNeeded = true;
        }
        break;
      case 'Bank login':
        if (!loanFile.banklogin_agent_id.trim()) {
          updateData.banklogin_agent_id = userId;
          updateData.banklogin_agent_name = userdetails.name
          updateData.banklogin_status = file_status;
          updateData.file_status = file_status;

          updateNeeded = true;
        } else {
          updateData.file_status = file_status;
          updateNeeded = true;
        }
        if (file_status === 'bank_login_approved') {
          updateData.approval_status = 'Pending';
          updateData.approval_assign_date = new Date();
          updateData.banklogin_action_date = new Date();

          updateData.banklogin_status = 'Completed';
          updateNeeded = true;
        }
        if (file_status === 'bank_login_rejected') {
          updateData.banklogin_status = 'Rejected';
          updateData.banklogin_action_date = new Date();
          updateNeeded = true;
        }
        break;
      default:
        return res.status(400).json({ message: 'Invalid role provided' });
    }

    if (updateNeeded) {
      const updatedFile = await loanfilemodel.findOneAndUpdate(
        { file_number },
        { $set: updateData },
        { new: true }
      );
      return res.status(201).json({
        message: 'Disposition created and agent ID updated successfully',
        data: { disposition: newDisposition, updatedFile }
      });
    } else {
      return res.status(200).json({
        message: 'Disposition created, but agent ID was not updated as it is already assigned or contains only spaces',
        data: newDisposition
      });
    }
  } catch (error) {
    console.error('Error creating disposition:', error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
};


const checkFileReassignStatus = async (req, res) => {
  try {
    const { file_number } = req.params;

    // Find loan file by file number
    const loanFile = await loanfilemodel.findOne({ file_number: file_number.trim() });

    if (!loanFile) {
      return res.status(404).json({
        success: false,
        message: `No record found with file number ${file_number}`
      });
    }

    // Check if the sales status is 'Interested'
    if (loanFile.sales_status === 'Interested') {
      if (!loanFile.sales_assign_date) {
        return res.status(400).json({
          success: false,
          message: 'Sales assign date not available for this file.'
        });
      }

      // Calculate the difference in days, including time
      const currentDate = moment();  // Get current date and time
      const salesAssignDate = moment(loanFile.sales_assign_date); // Use the exact stored date and time

      const daysDifference = currentDate.diff(salesAssignDate, 'days', true); // 'true' for floating point precision

      // Check if less than or equal to 10 days
      if (daysDifference <= 15) {
        return res.status(403).json({
          success: false,
          message: `File is locked for 10 days. Remaining locked period: ${Math.ceil(10 - daysDifference)} days.`  // Round up to give correct remaining days
        });
      } else {
        return res.status(200).json({
          success: true,
          message: 'File is allowed to be reassigned.'
        });
      }
    } else {
      return res.status(200).json({
        success: true,
        message: 'File can be reassigned as it is not marked as "Interested".'
      });
    }
  } catch (error) {
    console.error('Error while checking file reassign status:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while checking the file reassign status.',
      error: error.message
    });
  }
};




// const createdesposition = async (req, res) => {
//   // const { file_number } = req.params;
//   const {
//     userId,
//     role,
//     call_status,
//     is_interested,
//     disposition,
//     selected_documents,
//     expected_document_date,
//     not_interested_reason,
//     remarks,
//     file_status,
//     file_number
//   } = req.body;

//   const userdetails = await user.findOne({ userId });



//   try {
//     // Create a new disposition
//     const newDisposition = new dispositionmodel({
//       userId,
//       username:userdetails.name,
//       role,
//       department:"test",
//       call_status,
//       is_interested,
//       disposition,
//       selected_documents,
//       expected_document_date,
//       not_interested_reason,
//       remarks,
//       file_status,
//       file_number
//     });

//     // Save the new disposition
//     await newDisposition.save();
//     return res.status(201).json({ message: 'Disposition created successfully', data: newDisposition });
//   } catch (error) {
//     console.error('Error creating disposition:', error);
//     res.status(500).json({ message: 'Internal server error', error });
//   }
// };


const getdesposition = async (req, res) => {
  const { file_number } = req.params;

  try {
    const document = await dispositionmodel.find({ file_number });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.status(200).json({ data: document });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching document', error: error.message });
  }
};

const getDispositionById = async (req, res) => {
  const { _id } = req.params; // Extract _id from request parameters

  try {
    const document = await dispositionmodel.findById(_id); // Use findById to get the document by _id

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.status(200).json({ data: document });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching document', error: error.message });
  }
};

const createLoandetails = async (req, res) => {
  const { file_number } = req.params;

  try {
    const {
      bank_name,
      emi_amount,
      loan_term,
      loan_start_date,
      loan_end_date,
      emi_date,
      no_of_emi_bounces,
      bounces_reason,
      car_details
    } = req.body;

    // Create new loan document
    const newLoan = new LoandataModel({
      bank_name,
      emi_amount,
      loan_term,
      loan_start_date,
      loan_end_date,
      emi_date,
      no_of_emi_bounces,
      bounces_reason,
      car_details,
      file_number: file_number
    });

    // Save the loan entry to the database
    await newLoan.save();

    res.status(200).json({ message: 'Loan details added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding loan details', error: error.message });
  }
};

const updateLoandetails = async (req, res) => {
  const { loanId } = req.params; // Loan ID is passed in the URL

  try {
    const {
      bank_name,
      emi_amount,
      loan_term,
      loan_start_date,
      loan_end_date,
      emi_date,
      no_of_emi_bounces,
      bounces_reason,
      car_details
    } = req.body;

    // Find the loan document by loanId and update it with the new details
    const updatedLoan = await LoandataModel.findByIdAndUpdate(
      loanId, // Find by loanId
      {
        bank_name,
        emi_amount,
        loan_term,
        loan_start_date,
        loan_end_date,
        emi_date,
        no_of_emi_bounces,
        bounces_reason,
        car_details
      },
      { new: true } // Return the updated document
    );

    if (!updatedLoan) {
      return res.status(404).json({ message: 'Loan details not found' });
    }

    res.status(200).json({ message: 'Loan details updated successfully', data: updatedLoan });
  } catch (error) {
    res.status(500).json({ message: 'Error updating loan details', error: error.message });
  }
};

const deleteLoanDetails = async (req, res) => {
  const { _id } = req.params;

  try {
    // Find and delete the loan entry by its _id
    const deletedLoan = await LoandataModel.findByIdAndDelete(_id);

    if (!deletedLoan) {
      return res.status(404).json({ message: 'Loan details not found' });
    }

    res.status(200).json({ message: 'Loan details deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting loan details', error: error.message });
  }
};

// Get all loan details by file number
const getLoandetails = async (req, res) => {
  const { file_number } = req.params;
  console.log(file_number, "file_number");
  try {
    // Find all loan entries by file number
    const loanDetails = await LoandataModel.find({ file_number: file_number });

    if (!loanDetails || loanDetails.length === 0) {
      return res.status(404).json({ message: 'Loan details not found' });
    }

    res.status(200).json({ message: 'Loan details retrieved successfully', data: loanDetails });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving loan details', error: error.message });
  }
};

const getLoanfiledetailsbyfilenumber = async (req, res) => {
  const { file_number } = req.params;
  console.log(file_number, "file_number");

  try {
    // Find loan details by file number
    const loanDetails = await loanfilemodel.findOne({ file_number: file_number });

    if (!loanDetails) {
      return res.status(404).json({ message: 'Loan details not found' });
    }

    // Retrieve loan type and loan category from the persondetails collection
    const personDetails = await personal_details_model.findOne({ file_number: file_number }, 'type_of_loan loan_category');

    if (!personDetails) {
      return res.status(404).json({ message: 'Person details not found' });
    }

    // Retrieve agent IDs from loanDetails and convert them to strings
    const { sales_agent_id, tvr_agent_id, cdr_agent_id, banklogin_agent_id } = loanDetails;

    const agentIds = [sales_agent_id, tvr_agent_id, cdr_agent_id, banklogin_agent_id].map(String);

    // Find agent names by userId
    const agents = await user.find({ userId: { $in: agentIds } }, 'name userId');

    // Create a map to easily find agent names by their userId
    const agentMap = agents.reduce((acc, agent) => {
      acc[agent.userId] = agent.name;
      return acc;
    }, {});

    // Prepare the response with loan details and agent names
    const response = {
      type_of_loan: personDetails.type_of_loan,
      loan_category: personDetails.loan_category,
      sales_agent_name: agentMap[sales_agent_id] || 'N/A',
      tvr_agent_name: agentMap[tvr_agent_id] || 'N/A',
      cdr_agent_name: agentMap[cdr_agent_id] || 'N/A',
      banklogin_agent_name: agentMap[banklogin_agent_id] || 'N/A',
      loanDetails // Including other loan file details from loanfilemodel
    };

    res.status(200).json({ message: 'Loan details retrieved successfully', data: response });
  } catch (error) {
    console.error('Error retrieving loan details:', error);
    res.status(500).json({ message: 'Error retrieving loan details', error: error.message });
  }
};

// const getLoanFilesByUserId = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const sanitizedUserId = typeof userId === 'string' ? userId.trim() : '';

//     // Find the user by userId
//     const userRecord = await user.findOne({ userId: sanitizedUserId });
//     if (!userRecord) {
//       return res.status(404).json({
//         success: false,
//         message: `User not found with userId ${sanitizedUserId}`,
//       });
//     }

//     let query = {};

//     // Construct the query based on the user's role
//     if (userRecord.role === 'sales') {
//       query = { sales_agent_id: sanitizedUserId };
//     } else if (userRecord.role === 'CDR') {
//       query = { cdr_agent_id: sanitizedUserId };
//     } else if (userRecord.role === 'TVR') {
//       query = { tvr_agent_id: sanitizedUserId };
//     } else if (userRecord.role === 'admin') {
//       query = { sales_status: "Interested" };
//     } else if (userRecord.role === 'Team leader') {
//       query = {};
//     } else if (userRecord.role === 'Bank login') {
//       query = { banklogin_agent_id: sanitizedUserId };
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: `Invalid role for userId ${sanitizedUserId}`,
//       });
//     }

//     // Fetch loan files based on the constructed query
//     const loanFiles = await loanfilemodel.find(query).sort({ createdAt: -1 });

//     if (loanFiles.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: `No loan files found for userId ${sanitizedUserId}`,
//       });
//     }

//     // Fetch additional loan details and team leader name
//     const filesWithLoanDetails = await Promise.all(
//       loanFiles.map(async (file) => {
//         // Fetch the type of loan from personal details
//         const personalDetails = await personal_details_model.findOne({
//           file_number: file.file_number,
//         });

//         // Get the sales_agent_id from loanfile
//         const salesAgentId = file.sales_agent_id;

//         let teamLeaderName = 'Not Available';
//         if (salesAgentId) {
//           // Find the user associated with sales_agent_id to get reportingTo
//           const salesAgent = await user.findOne({ userId: salesAgentId });

//           if (salesAgent && salesAgent.reportingTo) {
//             // Find the team leader by the reportingTo value
//             const teamLeader = await user.findOne({ userId: salesAgent.reportingTo });
//             if (teamLeader) {
//               teamLeaderName = teamLeader.name;
//             }
//           }
//         }

//         // Return the loan file with additional details including team leader name
//         return {
//           ...file.toObject(),
//           type_of_loan: personalDetails ? personalDetails.type_of_loan : 'Not Updated',
//           teamleadername: teamLeaderName
//         };
//       })
//     );

//     // Return the loan files with additional details
//     return res.status(200).json({
//       success: true,
//       message: 'Records fetched successfully',
//       data: filesWithLoanDetails,
//     });
//   } catch (error) {
//     console.error('Error fetching loan files:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to fetch loan files',
//       error: error.message,
//     });
//   }
// };


// const getLoanFilesByUserId = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const sanitizedUserId = typeof userId === 'string' ? userId.trim() : '';

//     // Find the user by userId
//     const userRecord = await user.findOne({ userId: sanitizedUserId });
//     if (!userRecord) {
//       return res.status(404).json({
//         success: false,
//         message: `User not found with userId ${sanitizedUserId}`,
//       });
//     }

//     let query = {};

//     // Construct the query based on the user's role
//     if (userRecord.role === 'sales') {
//       query = { sales_agent_id: sanitizedUserId };
//     } else if (userRecord.role === 'CDR') {
//       query = { cdr_agent_id: sanitizedUserId };
//     } else if (userRecord.role === 'TVR') {
//       query = { tvr_agent_id: sanitizedUserId };
//     } else if (userRecord.role === 'admin') {
//       // Fetch loan files where sales_agent_id exists for admins
//       query = {
//         sales_status: "Interested"
//       };
//     } else if (userRecord.role === 'Team leader') {
//       // Fetch all loan files for team leaders (same as admin in this case)
//       query = {};
//     } else if (userRecord.role === 'Bank login') {
//       query = { banklogin_agent_id: sanitizedUserId };
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: `Invalid role for userId ${sanitizedUserId}`,
//       });
//     }

//     // Fetch loan files based on the constructed query
//     const loanFiles = await loanfilemodel.find(query).sort({ createdAt: -1 });

//     if (loanFiles.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: `No loan files found for userId ${sanitizedUserId}`,
//       });
//     }

//     // Fetch additional loan details (type_of_loan) from personal details
//     const filesWithLoanDetails = await Promise.all(
//       loanFiles.map(async (file) => {
//         const personalDetails = await personal_details_model.findOne({
//           file_number: file.file_number
//         });

//         return {
//           ...file.toObject(),
//           type_of_loan: personalDetails ? personalDetails.type_of_loan : 'Not Updated'
//         };
//       })
//     );

//     // Return the loan files with additional details
//     return res.status(200).json({
//       success: true,
//       message: 'Records fetched successfully',
//       data: filesWithLoanDetails
//     });
//   } catch (error) {
//     console.error('Error fetching loan files:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to fetch loan files',
//       error: error.message,
//     });
//   }
// };


// const getLoanFilesByUserId = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const {
//       startDate,   // New: filter by start date (ISO format)
//       endDate,     // New: filter by end date (ISO format)
//       teamLeaderName, // New: filter by team leader's name
//       salesAgentName  // New: filter by sales agent's name
//     } = req.query;

//     const sanitizedUserId = typeof userId === 'string' ? userId.trim() : '';

//     // Find the user by userId
//     const userRecord = await user.findOne({ userId: sanitizedUserId });
//     if (!userRecord) {
//       return res.status(404).json({
//         success: false,
//         message: `User not found with userId ${sanitizedUserId}`,
//       });
//     }

//     let query = {};

//     // Construct the query based on the user's role
//     if (userRecord.role === 'sales') {
//       query = { sales_agent_id: sanitizedUserId };
//     } else if (userRecord.role === 'CDR') {
//       query = { cdr_agent_id: sanitizedUserId };
//     } else if (userRecord.role === 'TVR') {
//       query = { tvr_agent_id: sanitizedUserId };
//     } else if (userRecord.role === 'admin') {
//       query = { sales_status: "Interested" };
//     } else if (userRecord.role === 'Team leader') {
//       query = {};
//     } else if (userRecord.role === 'Bank login') {
//       query = { banklogin_agent_id: sanitizedUserId };
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: `Invalid role for userId ${sanitizedUserId}`,
//       });
//     }

//     // Apply date range filter if provided
//     if (startDate && endDate) {
//       if (userRecord.role === 'sales') {
//         const start = new Date(startDate);
//         start.setHours(0, 0, 0, 0); // Set startDate to the beginning of the day (00:00:00)
//         const end = new Date(endDate);
//         end.setHours(23, 59, 59, 999);
//         query.sales_assign_date = { $gte: start, $lte: end };
//       }
//       else if (userRecord.role === 'TVR') {
//         const start = new Date(startDate);
//         start.setHours(0, 0, 0, 0); // Set startDate to the beginning of the day (00:00:00)
//         const end = new Date(endDate);
//         end.setHours(23, 59, 59, 999);
//         query.tvr_assign_date = { $gte: start, $lte: end };
        
//       }
//       else if (userRecord.role === 'CDR') {
//         const start = new Date(startDate);
//         start.setHours(0, 0, 0, 0); // Set startDate to the beginning of the day (00:00:00)
//         const end = new Date(endDate);
//         end.setHours(23, 59, 59, 999);
//         query.cdr_assign_date = { $gte: start, $lte: end };
        
//       }
//       else if (userRecord.role === 'Bank login') {
//         const start = new Date(startDate);
//         start.setHours(0, 0, 0, 0); // Set startDate to the beginning of the day (00:00:00)
//         const end = new Date(endDate);
//         end.setHours(23, 59, 59, 999);
//         query.banklogin_assign_date = { $gte: start, $lte: end };
        
//       }
//     }

//     // if (startDate && endDate) {
//     //   const start = new Date(startDate);
//     //   start.setHours(0, 0, 0, 0); // Set startDate to the beginning of the day (00:00:00)

//     //   const end = new Date(endDate);
//     //   end.setHours(23, 59, 59, 999); // Set endDate to the end of the day (23:59:59.999)

//     //   dateFilter.sales_assign_date = { $gte: start, $lte: end };
//     //   dispositiondateFilter.createdAt= { $gte: start, $lte: end };
//     // }

//     // Fetch loan files based on the constructed query
//     let loanFiles = await loanfilemodel.find(query);

//     // Apply sales agent name filter if provided
//     if (salesAgentName) {
//       const salesAgents = await user.find({
//         name: { $regex: salesAgentName, $options: 'i' }, // Case-insensitive match
//         role: 'sales'
//       }, 'userId');
//       const salesAgentIds = salesAgents.map(agent => agent.userId);
//       loanFiles = loanFiles.filter(file => salesAgentIds.includes(file.sales_agent_id));
//     }

//     // Fetch additional loan details and team leader name
//     const filesWithLoanDetails = await Promise.all(
//       loanFiles.map(async (file) => {
//         // Fetch the type of loan from personal details
//         const personalDetails = await personal_details_model.findOne({
//           file_number: file.file_number,
//         });

//         // Get the sales_agent_id from loanfile
//         const salesAgentId = file.sales_agent_id;

//         let teamLeaderNameResult = 'Not Available';
//         if (salesAgentId) {
//           // Find the user associated with sales_agent_id to get reportingTo
//           const salesAgent = await user.findOne({ userId: salesAgentId });

//           if (salesAgent && salesAgent.reportingTo) {
//             // Find the team leader by the reportingTo value
//             const teamLeader = await user.findOne({ userId: salesAgent.reportingTo });
//             if (teamLeader) {
//               teamLeaderNameResult = teamLeader.name;
//             }
//           }
//         }

//         // Apply team leader name filter if provided
//         if (teamLeaderName && teamLeaderNameResult.toLowerCase() !== teamLeaderName.toLowerCase()) {
//           return null; // Exclude the record if team leader name doesn't match
//         }

//         // Return the loan file with additional details including team leader name
//         return {
//           ...file.toObject(),
//           type_of_loan: personalDetails ? personalDetails.type_of_loan : 'Not Updated',
//           teamleadername: teamLeaderNameResult
//         };
//       })
//     );

//     // Filter out null values that didn't match team leader name filter
//     const filteredFiles = filesWithLoanDetails.filter(file => file !== null);

//     if (filteredFiles.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: `No loan files found for the given filters`,
//       });
//     }

//     // Return the loan files with additional details
//     return res.status(200).json({
//       success: true,
//       message: 'Records fetched successfully',
//       data: filteredFiles,
//     });
//   } catch (error) {
//     console.error('Error fetching loan files:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to fetch loan files',
//       error: error.message,
//     });
//   }
// };

const getLoanFilesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      startDate,   // New: filter by start date (ISO format)
      endDate,     // New: filter by end date (ISO format)
      teamLeaderName, // New: filter by team leader's name
      salesAgentName  // New: filter by sales agent's name
    } = req.query;

    const sanitizedUserId = typeof userId === 'string' ? userId.trim() : '';

    // Find the user by userId
    const userRecord = await user.findOne({ userId: sanitizedUserId });
    if (!userRecord) {
      return res.status(404).json({
        success: false,
        message: `User not found with userId ${sanitizedUserId}`,
      });
    }

    let query = {};

    // Construct the query based on the user's role
    switch(userRecord.role) {
      case 'sales':
        query = { sales_agent_id: sanitizedUserId };
        break;
      case 'CDR':
        query = { cdr_agent_id: sanitizedUserId };
        break;
      case 'TVR':
        query = { tvr_agent_id: sanitizedUserId };
        break;
      case 'admin':
        query = { sales_status: "Interested" };
        break;
      case 'Team leader':
        query = {};
        break;
      case 'Bank login':
        query = { banklogin_agent_id: sanitizedUserId };
        break;
      default:
        return res.status(400).json({
          success: false,
          message: `Invalid role for userId ${sanitizedUserId}`,
        });
    }

    // Apply date range filter if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Set time for startDate to beginning of the day
      start.setUTCHours(0, 0, 0, 0);

      // Set time for endDate to the end of the day
      end.setUTCHours(23, 59, 59, 999);

      // Apply the correct date field based on the role
      switch(userRecord.role) {
        case 'sales':
          query.sales_assign_date = { $gte: start, $lte: end };
          break;
        case 'TVR':
          query.tvr_assign_date = { $gte: start, $lte: end };
          break;
        case 'CDR':
          query.cdr_assign_date = { $gte: start, $lte: end };
          break;
        case 'Bank login':
          query.banklogin_assign_date = { $gte: start, $lte: end };
          break;
          case 'admin':
          query.sales_assign_date = { $gte: start, $lte: end };
          break;
      }
    }

    // Fetch loan files based on the constructed query
    let loanFiles = await loanfilemodel.find(query);

    // Apply sales agent name filter if provided
    if (salesAgentName) {
      const salesAgents = await user.find({
        name: { $regex: salesAgentName, $options: 'i' }, // Case-insensitive match
        role: 'sales'
      }, 'userId');
      const salesAgentIds = salesAgents.map(agent => agent.userId);
      loanFiles = loanFiles.filter(file => salesAgentIds.includes(file.sales_agent_id));
    }

    // Fetch additional loan details and team leader name
    const filesWithLoanDetails = await Promise.all(
      loanFiles.map(async (file) => {
        // Fetch the type of loan from personal details
        const personalDetails = await personal_details_model.findOne({
          file_number: file.file_number,
        });

        // Get the sales_agent_id from loanfile
        const salesAgentId = file.sales_agent_id;

        let teamLeaderNameResult = 'Not Available';
        if (salesAgentId) {
          // Find the user associated with sales_agent_id to get reportingTo
          const salesAgent = await user.findOne({ userId: salesAgentId });

          if (salesAgent && salesAgent.reportingTo) {
            // Find the team leader by the reportingTo value
            const teamLeader = await user.findOne({ userId: salesAgent.reportingTo });
            if (teamLeader) {
              teamLeaderNameResult = teamLeader.name;
            }
          }
        }

        // Apply team leader name filter if provided
        if (teamLeaderName && teamLeaderNameResult.toLowerCase() !== teamLeaderName.toLowerCase()) {
          return null; // Exclude the record if team leader name doesn't match
        }

        // Return the loan file with additional details including team leader name
        return {
          ...file.toObject(),
          type_of_loan: personalDetails ? personalDetails.type_of_loan : 'Not Updated',
          teamleadername: teamLeaderNameResult
        };
      })
    );

    // Filter out null values that didn't match team leader name filter
    const filteredFiles = filesWithLoanDetails.filter(file => file !== null);

    if (filteredFiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No loan files found for the given filters`,
      });
    }

    // Return the loan files with additional details
    return res.status(200).json({
      success: true,
      message: 'Records fetched successfully',
      data: filteredFiles,
    });
  } catch (error) {
    console.error('Error fetching loan files:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch loan files',
      error: error.message,
    });
  }
};


const admindashboardcount = async (req, res) => {
  try {
    // Extract the startDate and endDate from the query parameters
    const { startDate, endDate } = req.query;

    // If startDate or endDate is not provided, default to the first day and the current day of the month
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = endDate ? new Date(new Date(endDate).setHours(23, 59, 59)) : new Date();

    // Count loan files created within the date range
    const mtdFileCount = await loanfilemodel.countDocuments({
      createdAt: { $gte: start, $lte: end }
    });

    // Aggregate to count total loan files created within the date range by status
    const loanFileAggregation = await loanfilemodel.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          $or: [
            { tvr_status: { $in: ['Completed', 'Pending', 'Rejected'] } },
            { cdr_status: { $in: ['Completed', 'Pending', 'Rejected'] } },
            { banklogin_status: { $in: ['Completed', 'Pending', 'Rejected'] } },
            { file_status: { $in: ['process_to_tvr', 'process_to_cdr', 'process_to_login_team'] } }
          ]
        }
      },
      {
        $group: {
          _id: null,
          tvrCompleted: { $sum: { $cond: [{ $eq: ['$tvr_status', 'Completed'] }, 1, 0] } },
          tvrPending: { $sum: { $cond: [{ $eq: ['$tvr_status', 'Pending'] }, 1, 0] } },
          tvrRejected: { $sum: { $cond: [{ $eq: ['$tvr_status', 'Rejected'] }, 1, 0] } },
          cdrCompleted: { $sum: { $cond: [{ $eq: ['$cdr_status', 'Completed'] }, 1, 0] } },
          cdrPending: { $sum: { $cond: [{ $eq: ['$cdr_status', 'Pending'] }, 1, 0] } },
          cdrRejected: { $sum: { $cond: [{ $eq: ['$cdr_status', 'Rejected'] }, 1, 0] } },
          bankloginCompleted: { $sum: { $cond: [{ $eq: ['$banklogin_status', 'Completed'] }, 1, 0] } },
          bankloginPending: { $sum: { $cond: [{ $eq: ['$banklogin_status', 'Pending'] }, 1, 0] } },
          bankloginRejected: { $sum: { $cond: [{ $eq: ['$banklogin_status', 'Rejected'] }, 1, 0] } }
        }
      }
    ]);

    // Extract the first document from the aggregation result or initialize with default values
    const loanFileCount = loanFileAggregation[0] || {
      tvrCompleted: 0,
      tvrPending: 0,
      tvrRejected: 0,
      cdrCompleted: 0,
      cdrPending: 0,
      cdrRejected: 0,
      bankloginCompleted: 0,
      bankloginPending: 0,
      bankloginRejected: 0
    };

    // Count loan files marked as Interested within the date range
    const interestedCount = await loanfilemodel.countDocuments({
      sales_status: 'Interested',
      sales_assign_date: { $gte: start, $lte: end }
    });
    const pendingCounts = await loanfilemodel.aggregate([
      {
        $group: {
          _id: null, // We don't need to group by any specific field
          pendingtvrCount: {
            $sum: { $cond: [{ $eq: ["$tvr_status", "Pending"] }, 1, 0] }
          },
          pendingcdrCount: {
            $sum: { $cond: [{ $eq: ["$cdr_status", "Pending"] }, 1, 0] }
          },
          pendingbankloginCount: {
            $sum: { $cond: [{ $eq: ["$banklogin_status", "Pending"] }, 1, 0] }
          }
        }
      }
    ]);
    
    // Extract counts from the aggregation result
    const {
      pendingtvrCount = 0,
      pendingcdrCount = 0,
      pendingbankloginCount = 0
    } = pendingCounts[0] || {};
    // Count dispositions marked as NotInterested within the date range
    const notInterestedCount = await dispositionmodel.countDocuments({
      is_interested: 'NotInterested',
      createdAt: { $gte: start, $lte: end }
    });

    // Send the response with the aggregated data
    res.status(200).json({
      success: true,
      message: 'Counts fetched successfully',
      loanFileCount: mtdFileCount, // Total loan file documents count within the date range
      interestedCount, // Count of Interested loan files
      notInterestedCount, // Count of Not Interested dispositions
      tvrCompleted: loanFileCount.tvrCompleted,
      tvrPending: pendingtvrCount,
      tvrRejected: loanFileCount.tvrRejected,
      cdrCompleted: loanFileCount.cdrCompleted,
      cdrPending: pendingcdrCount,
      cdrRejected: loanFileCount.cdrRejected,
      bankloginCompleted: loanFileCount.bankloginCompleted,
      bankloginPending: pendingbankloginCount,
      bankloginRejected: loanFileCount.bankloginRejected
    });
  } catch (error) {
    console.error('Error fetching document counts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch document counts',
      error: error.message,
    });
  }
};

// const admindashboardcount = async (req, res) => {
//   try {
//     // Get the current date and first day of the current month
//     const currentDate = new Date();
//     const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

//     const mtdFileCount = await loanfilemodel.countDocuments({
//       createdAt: { $gte: firstDayOfMonth, $lte: currentDate }
//     });
//     // Aggregate to count total loan files created within the current month by status
//     const loanFileAggregation = await loanfilemodel.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: firstDayOfMonth, $lte: currentDate },
//           $or: [
//             { tvr_status: { $in: ['Completed', 'Pending', 'Rejected'] } },
//             { cdr_status: { $in: ['Completed', 'Pending', 'Rejected'] } },
//             { banklogin_status: { $in: ['Completed', 'Pending', 'Rejected'] } }
//           ]
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           tvrCompleted: { $sum: { $cond: [{ $eq: ['$tvr_status', 'Completed'] }, 1, 0] } },
//           tvrPending: { $sum: { $cond: [{ $eq: ['$tvr_status', 'Pending'] }, 1, 0] } },
//           tvrRejected: { $sum: { $cond: [{ $eq: ['$tvr_status', 'Rejected'] }, 1, 0] } },
//           cdrCompleted: { $sum: { $cond: [{ $eq: ['$cdr_status', 'Completed'] }, 1, 0] } },
//           cdrPending: { $sum: { $cond: [{ $eq: ['$cdr_status', 'Pending'] }, 1, 0] } },
//           cdrRejected: { $sum: { $cond: [{ $eq: ['$cdr_status', 'Rejected'] }, 1, 0] } },
//           bankloginCompleted: { $sum: { $cond: [{ $eq: ['$banklogin_status', 'Completed'] }, 1, 0] } },
//           bankloginPending: { $sum: { $cond: [{ $eq: ['$banklogin_status', 'Pending'] }, 1, 0] } },
//           bankloginRejected: { $sum: { $cond: [{ $eq: ['$banklogin_status', 'Rejected'] }, 1, 0] } }
//         }
//       }
//     ]);

//     // Extract the first document from the aggregation result or initialize with default values
//     const loanFileCount = loanFileAggregation[0] || {
//       tvrCompleted: 0,
//       tvrPending: 0,
//       tvrRejected: 0,
//       cdrCompleted: 0,
//       cdrPending: 0,
//       cdrRejected: 0,
//       bankloginCompleted: 0,
//       bankloginPending: 0,
//       bankloginRejected: 0
//     };

//     // Count loan files marked as Interested within the current month
//     const interestedCount = await dispositionmodel.countDocuments({
//       is_interested: 'Interested',
//       createdAt: { $gte: firstDayOfMonth, $lte: currentDate }
//     });

//     // Count dispositions marked as NotInterested within the current month
//     const notInterestedCount = await dispositionmodel.countDocuments({
//       is_interested: 'NotInterested',
//       createdAt: { $gte: firstDayOfMonth, $lte: currentDate }
//     });

//     // Send the response with the aggregated data
//     res.status(200).json({
//       success: true,
//       message: 'Counts fetched for the current month',
//       loanFileCount: mtdFileCount, // Total loan file documents count within the current month
//       interestedCount, // Count of Interested loan files
//       notInterestedCount, // Count of Not Interested dispositions
//       tvrCompleted: loanFileCount.tvrCompleted,
//       tvrPending: loanFileCount.tvrPending,
//       tvrRejected: loanFileCount.tvrRejected,
//       cdrCompleted: loanFileCount.cdrCompleted,
//       cdrPending: loanFileCount.cdrPending,
//       cdrRejected: loanFileCount.cdrRejected,
//       bankloginCompleted: loanFileCount.bankloginCompleted,
//       bankloginPending: loanFileCount.bankloginPending,
//       bankloginRejected: loanFileCount.bankloginRejected
//     });
//   } catch (error) {
//     console.error('Error fetching document counts:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch document counts',
//       error: error.message,
//     });
//   }
// };

const teamleaderdashboardcount = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query; // Accept startDate and endDate from query params

    // Get the current date if not provided
    const currentDate = endDate ? new Date(endDate) : new Date();
    const firstDayOfMonth = startDate ? new Date(startDate) : new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // Find all users who report to the given userId
    const reportingUsers = await user.find({ reportingTo: userId }).select('userId');
    const userIds = reportingUsers.map(user => user.userId);
    // console.log(userIds);

    const userdata = await user.findOne({ userId });


    // Add the main userId to the list of userIds
    userIds.push(userId);

    // Get the count of loan files created by users whose sales_agent_id matches any of the userIds
    const mtdFileCount = await loanfilemodel.countDocuments({
      sales_agent_id: { $in: userIds },
      sales_assign_date: { $gte: firstDayOfMonth, $lte: currentDate }
    });

    // Aggregate to count total loan files created within the specified date range by status and user
    const loanFileAggregation = await loanfilemodel.aggregate([
      {
        $match: {
          sales_agent_id: { $in: userIds },
          sales_assign_date: { $gte: firstDayOfMonth, $lte: currentDate },
          $or: [
            { sales_status: { $in: ['Interested'] } },
            { tvr_status: { $in: ['Completed', 'Pending', 'Rejected'] } },
            { cdr_status: { $in: ['Completed', 'Pending', 'Rejected'] } },
            { banklogin_status: { $in: ['Completed', 'Pending', 'Rejected'] } }
          ]
        }
      },
      {
        $group: {
          _id: null,
          interestedCount: { $sum: { $cond: [{ $eq: ['$sales_status', 'Interested'] }, 1, 0] } },
          tvrCompleted: { $sum: { $cond: [{ $eq: ['$tvr_status', 'Completed'] }, 1, 0] } },
          tvrPending: { $sum: { $cond: [{ $eq: ['$tvr_status', 'Pending'] }, 1, 0] } },
          tvrRejected: { $sum: { $cond: [{ $eq: ['$tvr_status', 'Rejected'] }, 1, 0] } },
          cdrCompleted: { $sum: { $cond: [{ $eq: ['$cdr_status', 'Completed'] }, 1, 0] } },
          cdrPending: { $sum: { $cond: [{ $eq: ['$cdr_status', 'Pending'] }, 1, 0] } },
          cdrRejected: { $sum: { $cond: [{ $eq: ['$cdr_status', 'Rejected'] }, 1, 0] } },
          bankloginCompleted: { $sum: { $cond: [{ $eq: ['$banklogin_status', 'Completed'] }, 1, 0] } },
          bankloginPending: { $sum: { $cond: [{ $eq: ['$banklogin_status', 'Pending'] }, 1, 0] } },
          bankloginRejected: { $sum: { $cond: [{ $eq: ['$banklogin_status', 'Rejected'] }, 1, 0] } }
        }
      }
    ]);

    // Extract the first document from the aggregation result or initialize with default values
    const loanFileCount = loanFileAggregation[0] || {
      interestedCount: 0,
      tvrCompleted: 0,
      tvrPending: 0,
      tvrRejected: 0,
      cdrCompleted: 0,
      cdrPending: 0,
      cdrRejected: 0,
      bankloginCompleted: 0,
      bankloginPending: 0,
      bankloginRejected: 0
    };

    // Count loan files marked as Interested for users whose sales_agent_id matches any of the userIds
    const interestedCount = await loanfilemodel.countDocuments({
      sales_agent_id: { $in: userIds },
      sales_status: 'Interested',
      sales_assign_date: { $gte: firstDayOfMonth, $lte: currentDate }
    });

    // console.log(firstDayOfMonth,currentDate)
    // Count dispositions marked as NotInterested for users whose sales_agent_id matches any of the userIds
    const notInterestedCount = await dispositionmodel.countDocuments({
      userId: { $in: userIds },
      is_interested: 'NotInterested',
      createdAt: { $gte: firstDayOfMonth, $lte: currentDate }
    });

    // Send the response with the aggregated data
    res.status(200).json({
      success: true,
      message: 'Counts fetched for the specified date range',
      loanFileCount: mtdFileCount, // Total loan file documents count within the specified date range
      interestedCount, // Count of Interested loan files
      notInterestedCount, // Count of Not Interested dispositions
      tvrCompleted: loanFileCount.tvrCompleted,
      tvrPending: loanFileCount.tvrPending,
      tvrRejected: loanFileCount.tvrRejected,
      cdrCompleted: loanFileCount.cdrCompleted,
      cdrPending: loanFileCount.cdrPending,
      cdrRejected: loanFileCount.cdrRejected,
      bankloginCompleted: loanFileCount.bankloginCompleted,
      bankloginPending: loanFileCount.bankloginPending,
      bankloginRejected: loanFileCount.bankloginRejected,
      username: userdata?.name || '',
    });
  } catch (error) {
    console.error('Error fetching document counts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch document counts',
      error: error.message,
    });
  }
};

const getDocumentsCountByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query; // Fetch start and end date from query params
    const sanitizedUserId = typeof userId === 'string' ? userId.trim() : '';

    // If startDate and endDate are provided, adjust them to cover the entire day
    const dateFilter = {};
    const dispositiondateFilter = {};
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0); // Set startDate to the beginning of the day (00:00:00)

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Set endDate to the end of the day (23:59:59.999)

      dateFilter.sales_assign_date = { $gte: start, $lte: end };
      dispositiondateFilter.createdAt = { $gte: start, $lte: end };
    }

    // Count total loan files created by the user
    const loanFileCount = await loanfilemodel.countDocuments({
      sales_agent_id: sanitizedUserId,
      ...dateFilter // Apply date filter here
    });

    // Count of Interested loan files
    const interestedCount = await loanfilemodel.countDocuments({
      sales_agent_id: sanitizedUserId,
      sales_status: 'Interested',
      ...dateFilter // Apply date filter here
    });

    // Count of Not Interested dispositions
    const notInterestedCount = await dispositionmodel.countDocuments({
      userId: sanitizedUserId,
      is_interested: 'NotInterested',
      ...dispositiondateFilter // Apply date filter here
    });

    const statusCounts = await loanfilemodel.aggregate([
      {
        $match: {
          sales_agent_id: sanitizedUserId,
          $or: [
            { tvr_status: { $in: ['Completed', 'Pending', 'Rejected'] } },
            { cdr_status: { $in: ['Completed', 'Pending', 'Rejected'] } },
            { banklogin_status: { $in: ['Completed', 'Pending', 'Rejected'] } }
          ],
          ...dateFilter // Apply date filter here
        }
      },
      {
        $group: {
          _id: null,
          tvrCompleted: { $sum: { $cond: [{ $eq: ['$tvr_status', 'Completed'] }, 1, 0] } },
          tvrPending: { $sum: { $cond: [{ $eq: ['$tvr_status', 'Pending'] }, 1, 0] } },
          tvrRejected: { $sum: { $cond: [{ $eq: ['$tvr_status', 'Rejected'] }, 1, 0] } },
          cdrCompleted: { $sum: { $cond: [{ $eq: ['$cdr_status', 'Completed'] }, 1, 0] } },
          cdrPending: { $sum: { $cond: [{ $eq: ['$cdr_status', 'Pending'] }, 1, 0] } },
          cdrRejected: { $sum: { $cond: [{ $eq: ['$cdr_status', 'Rejected'] }, 1, 0] } },
          bankloginCompleted: { $sum: { $cond: [{ $eq: ['$banklogin_status', 'Completed'] }, 1, 0] } },
          bankloginPending: { $sum: { $cond: [{ $eq: ['$banklogin_status', 'Pending'] }, 1, 0] } },
          bankloginRejected: { $sum: { $cond: [{ $eq: ['$banklogin_status', 'Rejected'] }, 1, 0] } }
        }
      }
    ]);

    const statusCountData = statusCounts[0] || {
      tvrCompleted: 0,
      tvrPending: 0,
      tvrRejected: 0,
      cdrCompleted: 0,
      cdrPending: 0,
      cdrRejected: 0,
      bankloginCompleted: 0,
      bankloginPending: 0,
      bankloginRejected: 0
    };

    const userdata = await user.findOne({ userId: sanitizedUserId });

    res.status(200).json({
      success: true,
      message: `Counts fetched for userId ${sanitizedUserId}`,
      loanFileCount,
      interestedCount,
      notInterestedCount,
      username: userdata?.name || '',
      ...statusCountData
    });
  } catch (error) {
    console.error('Error fetching document counts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch document counts',
      error: error.message,
    });
  }
};

// const getTvrDocumentsCountByUserId = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { startDate, endDate } = req.query; // Fetch start and end date from query params
//     const sanitizedUserId = typeof userId === 'string' ? userId.trim() : '';
//     // If startDate and endDate are provided, adjust them to cover the entire day
//     const dateFilter = {};
//     if (startDate && endDate) {
//       const start = new Date(startDate);
//       start.setHours(0, 0, 0, 0); // Set startDate to the beginning of the day (00:00:00)
//       console.log("start",start)

//       const end = new Date(endDate);
//       end.setHours(23, 59, 59, 999); // Set endDate to the end of the day (23:59:59.999)
//       console.log("end",end)

//       dateFilter.tvr_assign_date = { $gte: start, $lte: end };
//     }

//     // Count total loan files created by the user
//     const loanFileCount = await loanfilemodel.countDocuments({
//       tvr_agent_id: sanitizedUserId,
//       ...dateFilter // Apply date filter here
//     });

//     // Count of Interested loan files
//     const tvrCount = await loanfilemodel.countDocuments({
//       tvr_agent_id: sanitizedUserId,
//       tvr_status: 'Completed',
//       ...dateFilter // Apply date filter here
//     });

//     const statusCounts = await loanfilemodel.aggregate([
//       {
//         $match: {
//           tvr_agent_id: sanitizedUserId,
//           $or: [
//             { tvr_status: { $in: ['Completed', 'Pending', 'Rejected'] } },
//             { cdr_status: { $in: ['Completed', 'Pending', 'Rejected'] } },
//             { banklogin_status: { $in: ['Completed', 'Pending', 'Rejected'] } }
//           ],
//           ...dateFilter // Apply date filter here
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           tvrCompleted: { $sum: { $cond: [{ $eq: ['$tvr_status', 'Completed'] }, 1, 0] } },
//           tvrPending: { $sum: { $cond: [{ $eq: ['$tvr_status', 'Pending'] }, 1, 0] } },
//           tvrRejected: { $sum: { $cond: [{ $eq: ['$tvr_status', 'Rejected'] }, 1, 0] } },
//           cdrCompleted: { $sum: { $cond: [{ $eq: ['$cdr_status', 'Completed'] }, 1, 0] } },
//           cdrPending: { $sum: { $cond: [{ $eq: ['$cdr_status', 'Pending'] }, 1, 0] } },
//           cdrRejected: { $sum: { $cond: [{ $eq: ['$cdr_status', 'Rejected'] }, 1, 0] } },
//           bankloginCompleted: { $sum: { $cond: [{ $eq: ['$banklogin_status', 'Completed'] }, 1, 0] } },
//           bankloginPending: { $sum: { $cond: [{ $eq: ['$banklogin_status', 'Pending'] }, 1, 0] } },
//           bankloginRejected: { $sum: { $cond: [{ $eq: ['$banklogin_status', 'Rejected'] }, 1, 0] } }
//         }
//       }
//     ]);

//     const statusCountData = statusCounts[0] || {
//       tvrCompleted: 0,
//       tvrPending: 0,
//       tvrRejected: 0,
//       cdrCompleted: 0,
//       cdrPending: 0,
//       cdrRejected: 0,
//       bankloginCompleted: 0,
//       bankloginPending: 0,
//       bankloginRejected: 0
//     };

//     const userdata = await user.findOne({ userId: sanitizedUserId });

//     res.status(200).json({
//       success: true,
//       message: `Counts fetched for userId ${sanitizedUserId}`,
//       loanFileCount,
//       tvrCount,
//       username: userdata?.name || '',
//       ...statusCountData
//     });
//   } catch (error) {
//     console.error('Error fetching document counts:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch document counts',
//       error: error.message,
//     });
//   }
// };


const getTvrDocumentsCountByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query; // Fetch start and end date from query params

    const sanitizedUserId = typeof userId === 'string' ? userId.trim() : '';

    // Prepare date filters if startDate and endDate are provided
    const dateFilter = {};
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0); // Set startDate to the beginning of the day
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Set endDate to the end of the day

      dateFilter.tvr_assign_date = { $gte: start, $lte: end }; // Filter by tvr_assign_date field
    }

    // Count total loan files created by the user (filter by userId and date range)
    const loanFileCount = await loanfilemodel.countDocuments({
      tvr_agent_id: sanitizedUserId,
      ...dateFilter // Apply date filter here
    });
    console.log(sanitizedUserId,"sanitizedUserId")

    // Count of Completed loan files
    const tvrCount = await loanfilemodel.countDocuments({
      tvr_agent_id: sanitizedUserId,
      tvr_status: 'Completed',
      ...dateFilter // Apply date filter here
    });

    // Aggregate counts based on various status fields (tvr_status, cdr_status, banklogin_status)
    const statusCounts = await loanfilemodel.aggregate([
      {
        $match: {
          tvr_agent_id: sanitizedUserId,
          $or: [
            { tvr_status: { $in: ['Completed', 'Pending', 'Rejected'] } },
            { cdr_status: { $in: ['Completed', 'Pending', 'Rejected'] } },
            { banklogin_status: { $in: ['Completed', 'Pending', 'Rejected'] } }
          ],
          ...dateFilter 
        }
      },
      {
        $group: {
          _id: null,
          tvrCompleted: { $sum: { $cond: [{ $eq: ['$tvr_status', 'Completed'] }, 1, 0] } },
          tvrPending: { $sum: { $cond: [{ $eq: ['$tvr_status', 'Pending'] }, 1, 0] } },
          tvrRejected: { $sum: { $cond: [{ $eq: ['$tvr_status', 'Rejected'] }, 1, 0] } },
          cdrCompleted: { $sum: { $cond: [{ $eq: ['$cdr_status', 'Completed'] }, 1, 0] } },
          cdrPending: { $sum: { $cond: [{ $eq: ['$cdr_status', 'Pending'] }, 1, 0] } },
          cdrRejected: { $sum: { $cond: [{ $eq: ['$cdr_status', 'Rejected'] }, 1, 0] } },
          bankloginCompleted: { $sum: { $cond: [{ $eq: ['$banklogin_status', 'Completed'] }, 1, 0] } },
          bankloginPending: { $sum: { $cond: [{ $eq: ['$banklogin_status', 'Pending'] }, 1, 0] } },
          bankloginRejected: { $sum: { $cond: [{ $eq: ['$banklogin_status', 'Rejected'] }, 1, 0] } }
        }
      }
    ]);

    // Prepare default status count data if aggregation result is empty
    const statusCountData = statusCounts[0] || {
      tvrCompleted: 0,
      tvrPending: 0,
      tvrRejected: 0,
      cdrCompleted: 0,
      cdrPending: 0,
      cdrRejected: 0,
      bankloginCompleted: 0,
      bankloginPending: 0,
      bankloginRejected: 0
    };

    // Fetch user data to get the user's name (optional)
    const userdata = await user.findOne({ userId: sanitizedUserId });

    // Return the result with counts and user details
    res.status(200).json({
      success: true,
      message: `Counts fetched for userId ${sanitizedUserId}`,
      loanFileCount,
      tvrCount,
      username: userdata?.name || '',
      ...statusCountData
    });
  } catch (error) {
    console.error('Error fetching document counts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch document counts',
      error: error.message,
    });
  }
};

const getCdrDocumentsCountByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query; // Fetch start and end date from query params
    const sanitizedUserId = typeof userId === 'string' ? userId.trim() : '';

    // If startDate and endDate are provided, adjust them to cover the entire day
    const dateFilter = {};
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0); // Set startDate to the beginning of the day (00:00:00)

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Set endDate to the end of the day (23:59:59.999)

      dateFilter.cdr_assign_date = { $gte: start, $lte: end };

    }

    // Count total loan files created by the user
    const loanFileCount = await loanfilemodel.countDocuments({
      cdr_agent_id: sanitizedUserId,
      ...dateFilter // Apply date filter here
    });

    // Count of Interested loan files
    const cdrCount = await loanfilemodel.countDocuments({
      cdr_agent_id: sanitizedUserId,
      cdr_status: 'Completed',
      ...dateFilter // Apply date filter here
    });

    const statusCounts = await loanfilemodel.aggregate([
      {
        $match: {
          cdr_agent_id: sanitizedUserId,
          $or: [

            { cdr_status: { $in: ['Completed', 'Pending', 'Rejected'] } },
            { banklogin_status: { $in: ['Completed', 'Pending', 'Rejected'] } }
          ],
          ...dateFilter // Apply date filter here
        }
      },
      {
        $group: {
          _id: null,
          cdrCompleted: { $sum: { $cond: [{ $eq: ['$cdr_status', 'Completed'] }, 1, 0] } },
          cdrPending: { $sum: { $cond: [{ $eq: ['$cdr_status', 'Pending'] }, 1, 0] } },
          cdrRejected: { $sum: { $cond: [{ $eq: ['$cdr_status', 'Rejected'] }, 1, 0] } },
          bankloginCompleted: { $sum: { $cond: [{ $eq: ['$banklogin_status', 'Completed'] }, 1, 0] } },
          bankloginPending: { $sum: { $cond: [{ $eq: ['$banklogin_status', 'Pending'] }, 1, 0] } },
          bankloginRejected: { $sum: { $cond: [{ $eq: ['$banklogin_status', 'Rejected'] }, 1, 0] } }
        }
      }
    ]);

    const statusCountData = statusCounts[0] || {

      cdrCompleted: 0,
      cdrPending: 0,
      cdrRejected: 0,
      bankloginCompleted: 0,
      bankloginPending: 0,
      bankloginRejected: 0
    };

    const userdata = await user.findOne({ userId: sanitizedUserId });

    res.status(200).json({
      success: true,
      message: `Counts fetched for userId ${sanitizedUserId}`,
      loanFileCount,
      cdrCount,
      username: userdata?.name || '',
      ...statusCountData
    });
  } catch (error) {
    console.error('Error fetching document counts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch document counts',
      error: error.message,
    });
  }
};

const getBankDocumentsCountByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query; // Fetch start and end date from query params
    const sanitizedUserId = typeof userId === 'string' ? userId.trim() : '';

    // If startDate and endDate are provided, adjust them to cover the entire day
    const dateFilter = {};
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0); // Set startDate to the beginning of the day (00:00:00)

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Set endDate to the end of the day (23:59:59.999)

      dateFilter.cdr_assign_date = { $gte: start, $lte: end };

    }

    // Count total loan files created by the user
    const loanFileCount = await loanfilemodel.countDocuments({
      banklogin_agent_id: sanitizedUserId,
      ...dateFilter // Apply date filter here
    });

    // Count of Interested loan files
    const cdrCount = await loanfilemodel.countDocuments({
      banklogin_agent_id: sanitizedUserId,
      banklogin_status: 'Completed',
      ...dateFilter // Apply date filter here
    });

    const statusCounts = await loanfilemodel.aggregate([
      {
        $match: {
          banklogin_agent_id: sanitizedUserId,
          $or: [

            { banklogin_status: { $in: ['Completed', 'Pending', 'Rejected'] } },
            { banklogin_status: { $in: ['Completed', 'Pending', 'Rejected'] } }
          ],
          ...dateFilter // Apply date filter here
        }
      },
      {
        $group: {
          _id: null,

          bankloginCompleted: { $sum: { $cond: [{ $eq: ['$banklogin_status', 'Completed'] }, 1, 0] } },
          bankloginPending: { $sum: { $cond: [{ $eq: ['$banklogin_status', 'Pending'] }, 1, 0] } },
          bankloginRejected: { $sum: { $cond: [{ $eq: ['$banklogin_status', 'Rejected'] }, 1, 0] } }
        }
      }
    ]);

    const statusCountData = statusCounts[0] || {


      bankloginCompleted: 0,
      bankloginPending: 0,
      bankloginRejected: 0
    };

    const userdata = await user.findOne({ userId: sanitizedUserId });

    res.status(200).json({
      success: true,
      message: `Counts fetched for userId ${sanitizedUserId}`,
      loanFileCount,
      cdrCount,
      username: userdata?.name || '',
      ...statusCountData
    });
  } catch (error) {
    console.error('Error fetching document counts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch document counts',
      error: error.message,
    });
  }
};

const getAllLoanFiles = async (req, res) => {
  try {
    const loanFiles = await loanfilemodel.find();

    if (!loanFiles || loanFiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No loan files found',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Loan files retrieved successfully',
      data: loanFiles,
    });
  } catch (error) {
    console.error('Error fetching loan files:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch loan files',
      error: error.message,
    });
  }
};

const getProcessToTVRFiles = async (req, res) => {
  try {
    // Step 1: Fetch all records where file_status is "process_to_tvr" and tvr_agent_id is an empty string
    const files = await loanfilemodel.find({
      file_status: 'process_to_tvr',
      tvr_agent_id: ''
    }).lean();

    if (files.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No files found with status 'process_to_tvr' and empty 'tvr_agent_id'."
      });
    }

    // Step 2: Extract sales_agent_ids from the files
    const salesAgentIds = files.map(file => file.sales_agent_id);

    // Step 3: Fetch the corresponding sales agents' details from the user collection
    const salesAgents = await user.find({
      userId: { $in: salesAgentIds }
    }).select('userId name').lean();

    // Step 4: Create a map of userId -> name for easy lookup
    const salesAgentMap = salesAgents.reduce((acc, agent) => {
      acc[agent.userId] = agent.name;
      return acc;
    }, {});

    // Step 5: Extract file_numbers from the files
    const fileNumbers = files.map(file => file.file_number);

    // Step 6: Fetch the loan types and loan categories from the personal_details_model based on file_number
    const personalDetails = await personal_details_model.find({
      file_number: { $in: fileNumbers }
    }).select('file_number type_of_loan loan_category').lean();

    // Step 7: Create a map of file_number -> {loan_type, loan_category} for easy lookup
    const loanDetailsMap = personalDetails.reduce((acc, detail) => {
      acc[detail.file_number] = {
        type_of_loan: detail.type_of_loan,
        loan_category: detail.loan_category
      };
      return acc;
    }, {});

    // Step 8: Append the sales agent's name, loan type, and loan category to each file record
    const filesWithDetails = files.map(file => ({
      ...file,
      sales_agent_name: salesAgentMap[file.sales_agent_id] || 'Unknown Agent',
      type_of_loan: loanDetailsMap[file.file_number]?.type_of_loan || 'Unknown Loan Type',
      loan_category: loanDetailsMap[file.file_number]?.loan_category || 'Unknown Loan Category'
    }));

    return res.status(200).json({
      success: true,
      message: 'Records fetched successfully',
      data: filesWithDetails
    });
  } catch (error) {
    console.error('Error fetching process_to_tvr files:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch records',
      error: error.message
    });
  }
};

const getProcessToCDRFiles = async (req, res) => {
  try {
    // Fetch all records where file_status is "process_to_cdr" and cdr_agent_id is an empty string
    const files = await loanfilemodel.find({
      file_status: 'process_to_cdr',
      cdr_agent_id: '' // Correct empty string
    }).lean();

    if (files.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No files found with status 'process_to_cdr' and empty 'cdr_agent_id'."
      });
    }

    // Extract sales_agent_ids from the files
    const salesAgentIds = files.map(file => file.cdr_agent_id);

    // Fetch corresponding sales agents' details from the user collection
    const salesAgents = await user.find({
      userId: { $in: salesAgentIds }
    }).select('userId name').lean();

    // Create a map of userId -> name for easy lookup
    const salesAgentMap = salesAgents.reduce((acc, agent) => {
      acc[agent.userId] = agent.name;
      return acc;
    }, {});

    // Extract file_numbers from the files
    const fileNumbers = files.map(file => file.file_number);

    // Fetch loan types and loan categories from the personal_details_model based on file_number
    const personalDetails = await personal_details_model.find({
      file_number: { $in: fileNumbers }
    }).select('file_number type_of_loan loan_category').lean();

    // Create a map of file_number -> {loan_type, loan_category} for easy lookup
    const loanDetailsMap = personalDetails.reduce((acc, detail) => {
      acc[detail.file_number] = {
        type_of_loan: detail.type_of_loan,
        loan_category: detail.loan_category
      };
      return acc;
    }, {});

    // Append the sales agent's name, loan type, and loan category to each file record
    const filesWithLoanDetails = files.map(file => {
      const { type_of_loan = 'Unknown Loan Type', loan_category = 'Unknown Loan Category' } = loanDetailsMap[file.file_number] || {};

      return {
        ...file,
        // sales_agent_name: salesAgentMap[file.sales_agent_id] || 'Unknown Agent',
        type_of_loan,
        loan_category
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Records fetched successfully',
      data: filesWithLoanDetails
    });
  } catch (error) {
    console.error('Error fetching process_to_cdr files:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch records',
      error: error.message
    });
  }
};

const getProcessToBankloginFiles = async (req, res) => {
  try {
    // Fetch all records where file_status is "process_to_cdr" and cdr_agent_id is an empty string
    const files = await loanfilemodel.find({
      file_status: 'process_to_login_team',
      banklogin_agent_id: '' // Correct empty string
    }).lean();

    if (files.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No files found with status 'process_to_login_team' and empty 'cdr_agent_id'."
      });
    }

    // Extract sales_agent_ids from the files
    const salesAgentIds = files.map(file => file.sales_agent_id);

    // Fetch corresponding sales agents' details from the user collection
    const salesAgents = await user.find({
      userId: { $in: salesAgentIds }
    }).select('userId name').lean();

    // Create a map of userId -> name for easy lookup
    const salesAgentMap = salesAgents.reduce((acc, agent) => {
      acc[agent.userId] = agent.name;
      return acc;
    }, {});

    // Extract file_numbers from the files
    const fileNumbers = files.map(file => file.file_number);

    // Fetch loan types and loan categories from the personal_details_model based on file_number
    const personalDetails = await personal_details_model.find({
      file_number: { $in: fileNumbers }
    }).select('file_number type_of_loan loan_category').lean();

    // Create a map of file_number -> {loan_type, loan_category} for easy lookup
    const loanDetailsMap = personalDetails.reduce((acc, detail) => {
      acc[detail.file_number] = {
        type_of_loan: detail.type_of_loan,
        loan_category: detail.loan_category
      };
      return acc;
    }, {});

    // Append the sales agent's name, loan type, and loan category to each file record
    const filesWithLoanDetails = files.map(file => {
      const { type_of_loan = 'Unknown Loan Type', loan_category = 'Unknown Loan Category' } = loanDetailsMap[file.file_number] || {};

      return {
        ...file,
        sales_agent_name: salesAgentMap[file.sales_agent_id] || 'Unknown Agent',
        type_of_loan,
        loan_category
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Records fetched successfully',
      data: filesWithLoanDetails
    });
  } catch (error) {
    console.error('Error fetching process_to_banklogin files:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch records',
      error: error.message
    });
  }
}

const updatedocumentdata = async (req, res) => {
  try {
    const { file_number, document_type, document_name, downloadUrl, readUrl } = req.body;

    if (!file_number || !document_type || !document_name || !downloadUrl || !readUrl) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newAttachment = new attachmentmodel({
      file_number,
      document_type,
      document_name,
      downloadUrl,
      readUrl
    });

    const savedAttachment = await newAttachment.save();

    res.status(201).json({
      message: 'Attachment saved successfully',
      attachment: savedAttachment
    });
  } catch (error) {
    console.error('Error saving attachment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deletedocumentdata = async (req, res) => {
  try {
    const { id } = req.params; // Get the _id from request parameters

    if (!id) {
      return res.status(400).json({ error: 'Document ID is required' });
    }

    // Find and delete the document by _id
    const deletedAttachment = await attachmentmodel.findByIdAndDelete(id);

    if (!deletedAttachment) {
      return res.status(404).json({ error: 'Attachment not found' });
    }

    res.status(200).json({
      message: 'Attachment deleted successfully',
      attachment: deletedAttachment
    });
  } catch (error) {
    console.error('Error deleting attachment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getdocumentdata = async (req, res) => {
  try {
    const { file_number } = req.params;

    if (!file_number) {
      return res.status(400).json({ error: 'File name parameter is required' });
    }

    // Find all attachments where the file name matches the provided file_name
    const attachments = await attachmentmodel.find({ file_number: file_number });

    if (attachments.length === 0) {
      return res.status(404).json({ message: 'No attachments found for the given file name' });
    }

    res.status(200).json({
      message: 'Attachments retrieved successfully',
      attachments
    });
  } catch (error) {
    console.error('Error retrieving attachments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// const getSalesTeamLoanFiles = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     // Step 1: Find users where role is 'sales' and reportingTo is the userId from params
//     const salesUsers = await user.find({ role: 'sales', reportingTo: userId }).lean();
//     if (!salesUsers || salesUsers.length === 0) {
//       return res.status(404).json({
//         status: 404,
//         message: 'No Team Assigned to User',
//       });
//     }

//     // Step 2: Extract userIds from the fetched sales users
//     const salesUserIds = salesUsers.map(salesUser => salesUser.userId); // Assuming userId is a field in the user model
//     console.log(salesUserIds,"salesUserIds")

//     // Step 3: Find loan files where sales_agent_id matches the salesUserIds
//     const loanFiles = await loanfilemodel.find({ sales_agent_id: { $in: salesUserIds } }).lean();

//     if (!loanFiles || loanFiles.length === 0) {
//       return res.status(404).json({
//         status: 404,
//         message: 'No loan files found',
//       });
//     }

//     // Step 4: Map sales agents' names to their respective loan files
//     const loanFilesWithSalesAgent = loanFiles.map(loanFile => {
//       const salesAgent = salesUsers.find(salesUser => salesUser.userId === loanFile.sales_agent_id);
//       return {
//         ...loanFile,
//         sales_agent_name: salesAgent ? salesAgent.name : 'Unknown Agent', // Attach the sales agent's name
//       };
//     });

//     // Step 5: Return the result
//     return res.status(200).json({
//       status: 200,
//       message: `Loan files found for sales agents reporting to user with ID: ${userId}`,
//       data: loanFilesWithSalesAgent,
//     });

//   } catch (err) {
//     console.error('Error fetching loan files:', err);
//     return res.status(500).json({
//       status: 500,
//       message: 'Internal server error',
//       error: err.message,
//     });
//   }
// };


const getSalesTeamLoanFiles = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, salesAgentName } = req.query;

    // Step 1: Find users where role is 'sales' and reportingTo is the userId from params
    let salesQuery = { role: 'sales', reportingTo: userId };

    // Apply sales agent name filter, if provided
    if (salesAgentName) {
      salesQuery.name = salesAgentName;
    }

    const salesUsers = await user.find(salesQuery).lean();
    if (!salesUsers || salesUsers.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No Team Assigned to User or Sales Agent not found',
      });
    }

    // Step 2: Extract userIds from the fetched sales users
    const salesUserIds = salesUsers.map(salesUser => salesUser.userId); // Assuming userId is a field in the user model

    // Step 3: Build loan file query
    let loanFileQuery = { sales_agent_id: { $in: salesUserIds } };

    // Apply date range filter if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0); // Start of the day
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of the day

      loanFileQuery.sales_assign_date = {
        $gte: start,
        $lte: end
      };
    }

    // Step 4: Find loan files where sales_agent_id matches the salesUserIds and the date range matches
    const loanFiles = await loanfilemodel.find(loanFileQuery).lean();

    if (!loanFiles || loanFiles.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No loan files found for the provided filters',
      });
    }

    // Step 5: Map sales agents' names to their respective loan files
    const loanFilesWithSalesAgent = loanFiles.map(loanFile => {
      const salesAgent = salesUsers.find(salesUser => salesUser.userId === loanFile.sales_agent_id);
      return {
        ...loanFile,
        sales_agent_name: salesAgent ? salesAgent.name : 'Unknown Agent', // Attach the sales agent's name
      };
    });

    // Step 6: Return the result
    return res.status(200).json({
      status: 200,
      message: `Loan files found for sales agents reporting to user with ID: ${userId}`,
      data: loanFilesWithSalesAgent,
    });

  } catch (err) {
    console.error('Error fetching loan files:', err);
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      error: err.message,
    });
  }
};

const createbankStatement = async (req, res) => {
  try {
    const {
      file_number,
      userId,
      bankAccountNumber,
      totalAB,
      totalABB,
      oneYearABB,
      sixMonthABB,
      months
    } = req.body;

    // Create a new bank statement entry
    const newBankStatement = new BankStatementmodel({
      file_number,
      userId,
      bankAccountNumber,
      totalAB,
      totalABB,
      oneYearABB,
      sixMonthABB,
      months
    });

    // Save to the database
    await newBankStatement.save();

    res.status(201).json({
      message: 'Bank statement saved successfully',
      data: newBankStatement
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error saving bank statement',
      error: error.message
    });
  }
};

const updateBankStatement = async (req, res) => {
  try {
    const { _id } = req.params; // Get the ID from params
    const {
      file_number,
      userId,
      bankAccountNumber,
      totalAB,
      totalABB,
      oneYearABB,
      sixMonthABB,
      months
    } = req.body; // Get the fields from the request body

    // Find the bank statement by its ID and update it
    const updatedBankStatement = await BankStatementmodel.findByIdAndUpdate(
      _id,
      {
        file_number,
        userId,
        bankAccountNumber,
        totalAB,
        totalABB,
        oneYearABB,
        sixMonthABB,
        months
      },
      { new: true } // To return the updated document
    );

    if (!updatedBankStatement) {
      return res.status(404).json({ message: 'Bank statement not found' });
    }

    res.status(200).json({
      message: 'Bank statement updated successfully',
      data: updatedBankStatement
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating bank statement',
      error: error.message
    });
  }
};



const getbankStatement = async (req, res) => {
  try {
    const { file_number } = req.params;

    // Fetch data from the bankStatementModel collection
    const bankStatementData = await BankStatementmodel.find({ file_number: file_number });

    if (!bankStatementData) {
      return res.status(404).json({ message: 'Bank statement not found' });
    }

    // Return the retrieved data
    return res.status(200).json(bankStatementData);
  } catch (error) {
    console.error('Error fetching bank statement:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const viewbankStatement = async (req, res) => {
  try {
    const { id } = req.params; 
    const bankStatementData = await BankStatementmodel.findById(id);

    if (!bankStatementData) {
      return res.status(404).json({ message: 'Bank statement not found' });
    }

    // Return the retrieved data
    return res.status(200).json(bankStatementData);
  } catch (error) {
    console.error('Error fetching bank statement:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};


// const getLoanFilesByFilters = async (req, res) => {
//   try {
//     const { startDate, endDate, teamLeaderName, salesAgentName } = req.query;

//     // Build the query object based on provided filters
//     let query = {};

//     // Handle date range filter
//     if (startDate && endDate) {
//       const start = new Date(startDate);
//       start.setHours(0, 0, 0, 0); // Start of the day

//       const end = new Date(endDate);
//       end.setHours(23, 59, 59, 999); // End of the day

//       query.sales_assign_date = {
//         $gte: start,
//         $lte: end
//       };
//     }

//     // Fetch sales agent details if salesAgentName is provided
//     if (salesAgentName) {
//       const agents = await user.find({ name: salesAgentName }, 'userId'); // Fetch userIds matching the sales agent's name
//       const agentIds = agents.map(agent => agent.userId);

//       if (agentIds.length > 0) {
//         query.sales_agent_id = { $in: agentIds }; // Add filter for sales_agent_id
//       } else {
//         return res.status(404).json({
//           success: false,
//           message: 'No sales agent found with the provided name',
//         });
//       }
//     }

//     // Fetch team leader details if teamLeaderName is provided
//     if (teamLeaderName) {
//       const teamLeaders = await user.find({ name: teamLeaderName }, 'userId'); // Fetch userIds matching the team leader's name
//       const leaderIds = teamLeaders.map(leader => leader.userId);

//       if (leaderIds.length > 0) {
//         // Fetch sales agents reporting to this team leader
//         const agents = await user.find({ reportingTo: { $in: leaderIds } }, 'userId');
//         const agentIds = agents.map(agent => agent.userId);

//         if (agentIds.length > 0) {
//           query.sales_agent_id = { $in: agentIds }; // Add filter for sales_agent_id
//         } else {
//           return res.status(404).json({
//             success: false,
//             message: 'No sales agents found reporting to the provided team leader',
//           });
//         }
//       } else {
//         return res.status(404).json({
//           success: false,
//           message: 'No team leader found with the provided name',
//         });
//       }
//     }

//     // Fetch filtered loan files from the database
//     const loanFiles = await loanfilemodel.find(query).sort({ sales_assign_date: -1 });

//     if (loanFiles.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'No loan files found for the selected filters',
//       });
//     }

//     // Get unique sales_agent_ids
//     const salesAgentIds = [...new Set(loanFiles.map(file => file.sales_agent_id))];

//     // Fetch users whose userId matches salesAgentIds
//     const users = await user.find({ userId: { $in: salesAgentIds } }, 'userId name reportingTo');

//     // Create a mapping of sales_agent_id to name and reportingTo user IDs
//     const salesAgentMap = {};
//     users.forEach(user => {
//       salesAgentMap[user.userId] = {
//         name: user.name,
//         reportingTo: user.reportingTo
//       };
//     });

//     // Create an array of reportingTo user IDs
//     const reportingToIds = users.map(user => user.reportingTo).filter(Boolean);

//     // Fetch reportingTo users' names from User collection based on reportingTo user IDs
//     const reportingToUsers = await user.find({ userId: { $in: reportingToIds } }, 'userId name');

//     // Create a mapping of reportingTo user ID to name
//     const reportingToNameMap = {};
//     reportingToUsers.forEach(user => {
//       reportingToNameMap[user.userId] = user.name;
//     });

//     // Initialize response structure for each sales agent
//     const response = salesAgentIds.map(agentId => {
//       const loanFilesForAgent = loanFiles.filter(file => file.sales_agent_id === agentId);

//       // Count records for each status for the current sales agent
//       const salesInterestedCount = loanFilesForAgent.filter(file => file.sales_status === 'Interested').length;
//       const salesNotInterestedCount = loanFilesForAgent.filter(file => file.sales_status === 'Not Interested').length;

//       const tvrPendingCount = loanFilesForAgent.filter(file => file.tvr_status === 'Pending').length;
//       const tvrCompletedCount = loanFilesForAgent.filter(file => file.tvr_status === 'Completed').length;

//       const cdrPendingCount = loanFilesForAgent.filter(file => file.cdr_status === 'Pending').length;
//       const cdrCompletedCount = loanFilesForAgent.filter(file => file.cdr_status === 'Completed').length;

//       const bankLoginCount = loanFilesForAgent.filter(file => file.banklogin_status === 'Completed').length;

//       const approvalPendingCount = loanFilesForAgent.filter(file => file.approval_status === 'Pending').length;
//       const approvalCompletedCount = loanFilesForAgent.filter(file => file.approval_status === 'Completed').length;

//       const disbursalPendingCount = loanFilesForAgent.filter(file => file.disbursal_status === 'Pending').length;
//       const disbursalCompletedCount = loanFilesForAgent.filter(file => file.disbursal_status === 'Completed').length;

//       // Prepare the details for this sales agent
//       return {
//         sales_agent_id: agentId,
//         sales_agent_name: salesAgentMap[agentId]?.name || 'Unknown',
//         teamLeaderName: reportingToNameMap[salesAgentMap[agentId]?.reportingTo] || 'Unknown',
//         interested: salesInterestedCount,
//         notInterested: salesNotInterestedCount,
//         tvrPending: tvrPendingCount,
//         tvrCompleted: tvrCompletedCount,
//         cdrPending: cdrPendingCount,
//         cdrCompleted: cdrCompletedCount,
//         bankLogin: bankLoginCount,
//         approvalPending: approvalPendingCount,
//         approvalCompleted: approvalCompletedCount,
//         disbursalPending: disbursalPendingCount,
//         disbursalCompleted: disbursalCompletedCount,
//         date: loanFilesForAgent[0].sales_assign_date
//       };
//     });

//     // Return the aggregated data for each sales agent
//     return res.status(200).json({
//       success: true,
//       message: 'Loan files fetched and status counts calculated successfully',
//       data: response,
//     });
//   } catch (error) {
//     console.error('Error fetching loan files:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to fetch loan files',
//       error: error.message,
//     });
//   }
// };


const getLoanFilesByFilters = async (req, res) => {
  try {
    const { startDate, endDate, teamLeaderName, salesAgentName } = req.query;

    // Initialize start and end dates if they are provided
    let start, end;
    if (startDate && endDate) {
      start = new Date(startDate);
      start.setHours(0, 0, 0, 0); // Start of the day

      end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of the day
    }

    // Build the query object based on provided filters
    let query = {};

    // Handle date range filter if start and end dates are available
    if (start && end) {
      query.sales_assign_date = {
        $gte: start,
        $lte: end
      };
    }

    // Fetch sales agent details if salesAgentName is provided
    if (salesAgentName) {
      const agents = await user.find({ name: salesAgentName }, 'userId');
      const agentIds = agents.map(agent => agent.userId);

      if (agentIds.length > 0) {
        query.sales_agent_id = { $in: agentIds };
      } else {
        return res.status(404).json({
          success: false,
          message: 'No sales agent found with the provided name',
        });
      }
    }

    // Fetch team leader details if teamLeaderName is provided
    if (teamLeaderName) {
      const teamLeaders = await user.find({ name: teamLeaderName }, 'userId');
      const leaderIds = teamLeaders.map(leader => leader.userId);

      if (leaderIds.length > 0) {
        const agents = await user.find({ reportingTo: { $in: leaderIds } }, 'userId');
        const agentIds = agents.map(agent => agent.userId);

        if (agentIds.length > 0) {
          query.sales_agent_id = { $in: agentIds };
        } else {
          return res.status(404).json({
            success: false,
            message: 'No sales agents found reporting to the provided team leader',
          });
        }
      } else {
        return res.status(404).json({
          success: false,
          message: 'No team leader found with the provided name',
        });
      }
    }

    const loanFiles = await loanfilemodel.find(query).sort({ sales_assign_date: -1 });

    if (loanFiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No loan files found for the selected filters',
      });
    }

    const salesAgentIds = [...new Set(loanFiles.map(file => file.sales_agent_id))];
    const users = await user.find({ userId: { $in: salesAgentIds } }, 'userId name reportingTo');

    const salesAgentMap = {};
    users.forEach(user => {
      salesAgentMap[user.userId] = {
        name: user.name,
        reportingTo: user.reportingTo
      };
    });

    const reportingToIds = users.map(user => user.reportingTo).filter(Boolean);
    const reportingToUsers = await user.find({ userId: { $in: reportingToIds } }, 'userId name');

    const reportingToNameMap = {};
    reportingToUsers.forEach(user => {
      reportingToNameMap[user.userId] = user.name;
    });

    const response = salesAgentIds.map(agentId => {
      const loanFilesForAgent = loanFiles.filter(file => file.sales_agent_id === agentId);

      const salesInterestedCount = loanFilesForAgent.filter(file => 
        file.sales_status === 'Interested' && start && end && file.sales_assign_date >= start && file.sales_assign_date <= end
      ).length;

      const salesNotInterestedCount = loanFilesForAgent.filter(file => 
        file.sales_status === 'Not Interested' && start && end && file.sales_assign_date >= start && file.sales_assign_date <= end
      ).length;

      const tvrPendingCount = loanFilesForAgent.filter(file => 
        file.tvr_status === 'Pending' && start && end && file.tvr_assign_date >= start && file.tvr_assign_date <= end
      ).length;

      const tvrCompletedCount = loanFilesForAgent.filter(file => 
        file.tvr_status === 'Completed' && start && end && file.tvr_action_date >= start && file.tvr_action_date <= end
      ).length;

      const cdrPendingCount = loanFilesForAgent.filter(file => 
        file.cdr_status === 'Pending' && start && end && file.cdr_assign_date >= start && file.cdr_assign_date <= end
      ).length;

      const cdrCompletedCount = loanFilesForAgent.filter(file => 
        file.cdr_status === 'Completed' && start && end && file.cdr_action_date >= start && file.cdr_action_date <= end
      ).length;

      const bankLoginCount = loanFilesForAgent.filter(file => 
        file.banklogin_status === 'Completed' && start && end && file.banklogin_action_date >= start && file.banklogin_action_date <= end
      ).length;

      const approvalPendingCount = loanFilesForAgent.filter(file => 
        file.approval_status === 'Pending' && start && end && file.approval_action_date >= start && file.approval_action_date <= end
      ).length;

      const approvalCompletedCount = loanFilesForAgent.filter(file => 
        file.approval_status === 'Completed' && start && end && file.approval_action_date >= start && file.approval_action_date <= end
      ).length;

      const disbursalPendingCount = loanFilesForAgent.filter(file => 
        file.disbursal_status === 'Pending' && start && end && file.disbursal_action_date >= start && file.disbursal_action_date <= end
      ).length;

      const disbursalCompletedCount = loanFilesForAgent.filter(file => 
        file.disbursal_status === 'Completed' && start && end && file.disbursal_action_date >= start && file.disbursal_action_date <= end
      ).length;

      return {
        sales_agent_id: agentId,
        sales_agent_name: salesAgentMap[agentId]?.name || 'Unknown',
        teamLeaderName: reportingToNameMap[salesAgentMap[agentId]?.reportingTo] || 'Unknown',
        interested: salesInterestedCount,
        notInterested: salesNotInterestedCount,
        tvrPending: tvrPendingCount,
        tvrCompleted: tvrCompletedCount,
        cdrPending: cdrPendingCount,
        cdrCompleted: cdrCompletedCount,
        bankLogin: bankLoginCount,
        approvalPending: approvalPendingCount,
        approvalCompleted: approvalCompletedCount,
        disbursalPending: disbursalPendingCount,
        disbursalCompleted: disbursalCompletedCount,
        date: loanFilesForAgent[0].sales_assign_date
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Loan files fetched and status counts calculated successfully',
      data: response,
    });
  } catch (error) {
    console.error('Error fetching loan files:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch loan files',
      error: error.message,
    });
  }
};




const getteamleaderperformance = async (req, res) => {
  try {
    const { userId } = req.params; // Get reportingTo (team leader) from the params
    const { startDate, endDate } = req.query; // Get startDate and endDate from the query params

    // Find all users who report to the given userId
    const usersReportingTo = await user.find({ reportingTo: userId }, 'userId name reportingTo');
    // console.log(usersReportingTo, "usersReportingTo")

    // If no users are found, return an empty response
    if (usersReportingTo.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No sales agents found for the given reportingTo (team leader)',
      });
    }
    // Get userIds of sales agents who report to the given userId
    const salesAgentIds = usersReportingTo.map(user => user.userId);

    // Build the date filter for loan file search
    let dateQuery = {};
    if (startDate && endDate) {
      const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
      const formattedEndDate = new Date(endDate).toISOString().split('T')[0];

      dateQuery.sales_assign_date = {
        $gte: new Date(`${formattedStartDate}T00:00:00.000Z`),
        $lte: new Date(`${formattedEndDate}T23:59:59.999Z`)
      };
    }

    // Fetch loan files for the found sales agents (filter by sales_agent_id and date)
    const loanFiles = await loanfilemodel.find({
      sales_agent_id: { $in: salesAgentIds },
      ...dateQuery // Add the date filter if applicable
    });

    // If no loan files are found, return an empty response
    if (loanFiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No loan files found for the given filters',
      });
    }

    // Create a mapping of sales_agent_id to name and reportingTo from usersReportingTo
    const salesAgentMap = {};
    usersReportingTo.forEach(user => {
      salesAgentMap[user.userId] = {
        name: user.name,
        reportingTo: user.reportingTo
      };
    });

    // Fetch reportingTo (team leader) names
    const reportingToIds = usersReportingTo.map(user => user.reportingTo).filter(Boolean); // Filter out undefined values

    const reportingToUsers = await user.find({ userId: { $in: reportingToIds } }, 'userId name');

    // Create a mapping of reportingTo user ID to name
    const reportingToNameMap = {};
    reportingToUsers.forEach(user => {
      reportingToNameMap[user.userId] = user.name;
    });

    // Prepare response structure for each sales agent
    const response = salesAgentIds.map(agentId => {
      const loanFilesForAgent = loanFiles.filter(file => file.sales_agent_id === agentId);

      const salesInterestedCount = loanFilesForAgent.filter(file => file.sales_status === 'Interested').length;
      const salesNotInterestedCount = loanFilesForAgent.filter(file => file.sales_status === 'Not Interested').length;

      const tvrPendingCount = loanFilesForAgent.filter(file => file.tvr_status === 'Pending').length;
      const tvrCompletedCount = loanFilesForAgent.filter(file => file.tvr_status === 'Completed').length;

      const cdrPendingCount = loanFilesForAgent.filter(file => file.cdr_status === 'Pending').length;
      const cdrCompletedCount = loanFilesForAgent.filter(file => file.cdr_status === 'Completed').length;

      const bankLoginCount = loanFilesForAgent.filter(file => file.banklogin_status === 'Completed').length;

      const approvalPendingCount = loanFilesForAgent.filter(file => file.approval_status === 'Pending').length;
      const approvalCompletedCount = loanFilesForAgent.filter(file => file.approval_status === 'Completed').length;

      const disbursalPendingCount = loanFilesForAgent.filter(file => file.disbursal_status === 'Pending').length;
      const disbursalCompletedCount = loanFilesForAgent.filter(file => file.disbursal_status === 'Completed').length;

      return {
        sales_agent_id: agentId,
        sales_agent_name: salesAgentMap[agentId]?.name || 'Unknown',
        teamLeaderName: reportingToNameMap[salesAgentMap[agentId]?.reportingTo] || 'Unknown',
        interested: salesInterestedCount,
        notInterested: salesNotInterestedCount,
        tvrPending: tvrPendingCount,
        tvrCompleted: tvrCompletedCount,
        cdrPending: cdrPendingCount,
        cdrCompleted: cdrCompletedCount,
        bankLogin: bankLoginCount,
        approvalPending: approvalPendingCount,
        approvalCompleted: approvalCompletedCount,
        disbursalPending: disbursalPendingCount,
        disbursalCompleted: disbursalCompletedCount,
        date: loanFilesForAgent[0]?.sales_assign_date || null
      };
    });

    // Return the aggregated data for each sales agent
    return res.status(200).json({
      success: true,
      message: 'Loan files fetched and status counts calculated successfully',
      data: response,
    });
  } catch (error) {
    console.error('Error fetching loan files:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch loan files',
      error: error.message,
    });
  }
};

const getteamleaderLoanFilesByFilters = async (req, res) => {
  try {
    const { startDate, endDate, salesAgentName, userId } = req.query;

    // Build the query object based on provided filters
    let query = {};

    // Handle date range filter
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0); // Start of the day

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of the day

      query.sales_assign_date = {
        $gte: start,
        $lte: end
      };
    }

    // Fetch sales agent details if salesAgentName is provided
    if (salesAgentName) {
      const agents = await user.find({ reportingTo: userId }, 'userId'); // Fetch userIds matching the sales agent's name
      const agentIds = agents.map(agent => agent.userId);

      if (agentIds.length > 0) {
        query.sales_agent_id = { $in: agentIds }; // Add filter for sales_agent_id
      } else {
        return res.status(404).json({
          success: false,
          message: 'No sales agent found with the provided name',
        });
      }
    }

    // Fetch sales agents reporting to the provided team leader's userId
    if (userId) {
      const agents = await user.find({ reportingTo: userId }, 'userId'); // Find all agents reporting to the provided team leader userId
      const agentIds = agents.map(agent => agent.userId);

      if (agentIds.length > 0) {
        query.sales_agent_id = { $in: agentIds }; // Add filter for sales_agent_id
      } else {
        return res.status(404).json({
          success: false,
          message: 'No sales agents found reporting to the provided team leader',
        });
      }
    }

    // Fetch filtered loan files from the database
    const loanFiles = await loanfilemodel.find(query).sort({ sales_assign_date: -1 });

    if (loanFiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No loan files found for the selected filters',
      });
    }

    // Get unique sales_agent_ids
    const salesAgentIds = [...new Set(loanFiles.map(file => file.sales_agent_id))];

    // Fetch users whose userId matches salesAgentIds
    const users = await user.find({ userId: { $in: salesAgentIds } }, 'userId name reportingTo');

    // Create a mapping of sales_agent_id to name and reportingTo user IDs
    const salesAgentMap = {};
    users.forEach(user => {
      salesAgentMap[user.userId] = {
        name: user.name,
        reportingTo: user.reportingTo
      };
    });

    // Create an array of reportingTo user IDs
    const reportingToIds = users.map(user => user.reportingTo).filter(Boolean);

    // Fetch reportingTo users' names from User collection based on reportingTo user IDs
    const reportingToUsers = await user.find({ userId: { $in: reportingToIds } }, 'userId name');

    // Create a mapping of reportingTo user ID to name
    const reportingToNameMap = {};
    reportingToUsers.forEach(user => {
      reportingToNameMap[user.userId] = user.name;
    });

    // Initialize response structure for each sales agent
    const response = salesAgentIds.map(agentId => {
      const loanFilesForAgent = loanFiles.filter(file => file.sales_agent_id === agentId);

      // Count records for each status for the current sales agent
      const salesInterestedCount = loanFilesForAgent.filter(file => file.sales_status === 'Interested').length;
      const salesNotInterestedCount = loanFilesForAgent.filter(file => file.sales_status === 'Not Interested').length;

      const tvrPendingCount = loanFilesForAgent.filter(file => file.tvr_status === 'Pending').length;
      const tvrCompletedCount = loanFilesForAgent.filter(file => file.tvr_status === 'Completed').length;

      const cdrPendingCount = loanFilesForAgent.filter(file => file.cdr_status === 'Pending').length;
      const cdrCompletedCount = loanFilesForAgent.filter(file => file.cdr_status === 'Completed').length;

      const bankLoginCount = loanFilesForAgent.filter(file => file.banklogin_status === 'Completed').length;

      const approvalPendingCount = loanFilesForAgent.filter(file => file.approval_status === 'Pending').length;
      const approvalCompletedCount = loanFilesForAgent.filter(file => file.approval_status === 'Completed').length;

      const disbursalPendingCount = loanFilesForAgent.filter(file => file.disbursal_status === 'Pending').length;
      const disbursalCompletedCount = loanFilesForAgent.filter(file => file.disbursal_status === 'Completed').length;

      // Prepare the details for this sales agent
      return {
        sales_agent_id: agentId,
        sales_agent_name: salesAgentMap[agentId]?.name || 'Unknown',
        teamLeaderName: reportingToNameMap[salesAgentMap[agentId]?.reportingTo] || 'Unknown',
        interested: salesInterestedCount,
        notInterested: salesNotInterestedCount,
        tvrPending: tvrPendingCount,
        tvrCompleted: tvrCompletedCount,
        cdrPending: cdrPendingCount,
        cdrCompleted: cdrCompletedCount,
        bankLogin: bankLoginCount,
        approvalPending: approvalPendingCount,
        approvalCompleted: approvalCompletedCount,
        disbursalPending: disbursalPendingCount,
        disbursalCompleted: disbursalCompletedCount,
        date: loanFilesForAgent[0].sales_assign_date
      };
    });

    // Return the aggregated data for each sales agent
    return res.status(200).json({
      success: true,
      message: 'Loan files fetched and status counts calculated successfully',
      data: response,
    });
  } catch (error) {
    console.error('Error fetching loan files:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch loan files',
      error: error.message,
    });
  }
};

const getbanklogindetailsbyid = async (req, res) => {
  const { _id } = req.params;

  try {
    const bankLoginDetails = await BankDetail.findById(_id);

    if (!bankLoginDetails) {
      return res.status(404).json({ message: 'No records found' });
    }

    // Return data as an array
    res.status(200).json([bankLoginDetails]);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving records', error: error.message });
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
  getreferencedetail,
  createdesposition,
  getdesposition,
  createLoandetails,
  getLoandetails,
  getDocumentsCountByUserId,
  getTvrDocumentsCountByUserId,
  getCdrDocumentsCountByUserId,
  getLoanFilesByUserId,
  admindashboardcount,
  getAllLoanFiles,
  getProcessToTVRFiles,
  getProcessToCDRFiles,
  updatedocumentdata,
  getdocumentdata,
  getSalesTeamLoanFiles,
  getProcessToBankloginFiles,
  getLoanfiledetailsbyfilenumber,
  getDispositionById,
  checkFileReassignStatus,
  teamleaderdashboardcount,
  createbankStatement,
  getbankStatement,
  getLoanFilesByFilters,
  getteamleaderperformance,
  getteamleaderLoanFilesByFilters,
  deletedocumentdata,
  viewbankStatement,
  updateBankStatement,
  updateLoandetails,
  updatereferencedetail,
  getbanklogindetailsbyid,
  deleteLoanDetails,
  deletereferencedetail
};