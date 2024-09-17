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
    
    const batchSize = 100; // Define the batch size (adjustable based on performance)
    const totalBatches = Math.ceil(data.length / batchSize); // Calculate the total number of batches

    // Process data in batches to prevent overloading memory
    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const batch = data.slice(batchIndex * batchSize, (batchIndex + 1) * batchSize);

      // Transform and validate data
      const transformedData = await Promise.all(batch.map(async (item) => {
        // Generate a unique 5-digit file number for each entry
        const fileNumber = await generateFileNumber();

        // Insert the transformed data into the first collection
        const overviewDoc = {
          file_number: fileNumber,
          mobile_number: item["Customer Number"],
          previous_loan_bank_name: item["Bank Name"],
          previous_product_model: item["Product Name"],
          previous_loan_sanction_date: item["Loan Sanction Date"],
          customer_name: item["Customer Name"],
          previous_loan_type: item["Loan Type"],
          previous_loan_amount: item["Loan Amount"],
          previous_loan_insurance_value: item["Insurance"],
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
          // Additional fields as needed
        };

        // Insert into the second collection (loanfilesSchema)
        const fileStatusDoc = {
          file_number: fileNumber,
          customer_name: item["Customer Name"],
          customer_mobile_number: item["Customer Number"],
          // Default values for the rest of the fields in loanfilesSchema
        };

        // Save both documents in parallel
        await Promise.all([
          overview_details.create(overviewDoc),
          loanfilemodel.create(fileStatusDoc),
        ]);

        return overviewDoc; // Return the overview data (can be omitted if not needed)
      }));

      console.log(`Batch ${batchIndex + 1} processed successfully`);
    }

    res.status(200).json({ message: 'Data stored successfully!' });
  } catch (error) {
    console.error('Error in processing data:', error);
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

  console.log(file_status,"file_status")
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
        if (!loanFile.sales_agent_id.trim()) {
          updateData.sales_agent_id = userId;
          updateData.sales_status = call_status;
          updateData.file_status=file_status;
          updateNeeded = true;
        }
        else{
          updateData.file_status=file_status;
          updateNeeded = true;
        }
        break;
      case 'TVR':
        if (!loanFile.tvr_agent_id.trim()) {
          updateData.tvr_agent_id = userId;
          updateData.tvr_status = call_status;
          updateData.file_status=file_status;
          updateNeeded = true;
        }else{
          updateData.file_status=file_status;
          updateNeeded = true;
        }
        break;
      case 'CDR':
        if (!loanFile.cdr_agent_id.trim()) {
          updateData.cdr_agent_id = userId;
          updateData.cdr_status = call_status;
          updateData.file_status=file_status;
          updateNeeded = true;
        }else{
          updateData.file_status=file_status;
          updateNeeded = true;
        }
        break;
      case 'BankLogin':
        if (!loanFile.banklogin_agent_id.trim()) {
          updateData.banklogin_agent_id = userId;
          updateData.bank_login_status = call_status;
          updateData.file_status=file_status;
          updateNeeded = true;
        }else{
          updateData.file_status=file_status;
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

const getDocumentsCountByUserId = async (req, res) => {
  try {
    const { userId } = req.params; 
    const sanitizedUserId = typeof userId === 'string' ? userId.trim() : '';
    const loanFileCount = await loanfilemodel.countDocuments({ sales_agent_id: sanitizedUserId });
    const interestedCount = await loanfilemodel.countDocuments({ 
      userId: sanitizedUserId,
      is_interested: 'Interested' 
    });
    const notInterestedCount = await dispositionmodel.countDocuments({ 
      userId: sanitizedUserId,
      is_interested: 'NotInterested' 
    });

    const userdata= await user.findOne({userId});
  
    res.status(200).json({
      success: true,
      message: `Counts fetched for userId ${sanitizedUserId}`,
      loanFileCount, // Total loan file documents count
      interestedCount, // Count of Interested
      notInterestedCount,
      username: userdata.name// Count of Not Interested
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


const getdesposition= async (req, res) => {
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
      file_number:file_number
    });

    // Save the loan entry to the database
    await newLoan.save();
    
    res.status(200).json({ message: 'Loan details added successfully'});
  } catch (error) {
    res.status(500).json({ message: 'Error adding loan details', error: error.message });
  }
};

// Get all loan details by file number
const getLoandetails = async (req, res) => {
  const { file_number } = req.params;

  try {
    // Find all loan entries by file number
    const loanDetails = await LoandataModel.find({ file_number });

    if (!loanDetails || loanDetails.length === 0) {
      return res.status(404).json({ message: 'Loan details not found' });
    }

    res.status(200).json({ message: 'Loan details retrieved successfully', data: loanDetails });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving loan details', error: error.message });
  }
};

const getLoanFilesByUserId = async (req, res) => {
  try {
    const { userId } = req.params; 
    const sanitizedUserId = typeof userId === 'string' ? userId.trim() : '';

    // Fetch user details based on userId
    const userRecord = await user.findOne({ userId: sanitizedUserId });
    
    // If no user found, return an error
    if (!userRecord) {
      return res.status(404).json({
        success: false,
        message: `User not found with userId ${sanitizedUserId}`,
      });
    }

    // Determine the query based on user role
    let query = {};
    if (userRecord.role === 'sales') {
      query = { sales_agent_id: sanitizedUserId };
    } else if (userRecord.role === 'CDR') {
      query = { cdr_agent_id: sanitizedUserId };
    } else if (userRecord.role === 'TVR') {
      query = { tvr_agent_id: sanitizedUserId };
    } else if (userRecord.role === 'admin') {
      query = {}; // Admin gets all loan files
    } else {
      return res.status(400).json({
        success: false,
        message: `Invalid role for userId ${sanitizedUserId}`,
      });
    }

    // Fetch loan files based on the constructed query
    const loanFiles = await loanfilemodel.find(query);

    if (loanFiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No loan files found for userId ${sanitizedUserId}`,
      });
    }


    const filesWithLoanDetails = await Promise.all(
      loanFiles.map(async (file) => {
        const personalDetails = await personal_details_model.findOne({
          file_number: file.file_number
        });

        // Include type_of_loan if found, or return null if not available
        return {
          ...file.toObject(),
          type_of_loan: personalDetails ? personalDetails.type_of_loan : 'Not Available'
        };
      })
    );
    // Return the loan files found
    return res.status(200).json({
      success: true,
      message: 'Records fetched successfully',
      data: filesWithLoanDetails
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
    // Get the current date and first day of the current month
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // Count total loan files created within the current month
    const loanFileCount = await loanfilemodel.countDocuments({
      createdAt: { $gte: firstDayOfMonth, $lte: currentDate }
    });

    // Count loan files marked as Interested within the current month
    const interestedCount = await dispositionmodel.countDocuments({
      is_interested: 'Interested',
      createdAt: { $gte: firstDayOfMonth, $lte: currentDate }
    });

    // Count dispositions marked as NotInterested within the current month
    const notInterestedCount = await dispositionmodel.countDocuments({
      is_interested: 'NotInterested',
      createdAt: { $gte: firstDayOfMonth, $lte: currentDate }
    });

    res.status(200).json({
      success: true,
      message: 'Counts fetched for the current month',
      loanFileCount, // Total loan file documents count within the current month
      interestedCount, // Count of Interested loan files
      notInterestedCount // Count of Not Interested dispositions
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
    // Fetch all records where file_status is "process_to_tvr" and tvr_agent_id is an empty string
    const files = await loanfilemodel.find({
      file_status: 'process_to_tvr',
      tvr_agent_id: ' '
    });

    if (files.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No files found with status 'process_to_tvr' and empty 'tvr_agent_id'."
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Records fetched successfully',
      data: files
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
    const loanFiles = await loanfilemodel.find({
      file_status: 'process_to_cdr',
      cdr_agent_id: ' ' // Ensure this is correct, or replace with "" if required
    });

    if (loanFiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No files found with status 'process_to_cdr' and empty 'cdr_agent_id'."
      });
    }

    // Fetch the type_of_loan from the personal_details_model using the file_number from loanFiles
    const filesWithLoanDetails = await Promise.all(
      loanFiles.map(async (file) => {
        const personalDetails = await personal_details_model.findOne({
          file_number: file.file_number
        });

        // Include type_of_loan if found, or return null if not available
        return {
          ...file.toObject(),
          type_of_loan: personalDetails ? personalDetails.type_of_loan : 'Not Available'
        };
      })
    );

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


const updatedocumentdata= async (req, res) => {
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


const getdocumentdata=async (req, res) => {
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
  getLoanFilesByUserId,
  admindashboardcount,
  getAllLoanFiles,
  getProcessToTVRFiles,
  getProcessToCDRFiles,
  updatedocumentdata,
  getdocumentdata
};