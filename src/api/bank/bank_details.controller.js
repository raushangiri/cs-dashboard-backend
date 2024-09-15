const bank_details = require("../../model/bank.model");
const documents = require("../../model/document.model");
const banklogin_details = require("../../model/banklogin.model");


const get_rmDetails = async (req, res) => {
  try {
    const { loan_type, bank_name } = req.body;  // Extract loan_type and bank_name from the request body
    
    // Check if both loan_type and bank_name are provided
    if (!loan_type || !bank_name) {
      return res.status(400).json({ error: 'Loan type and Bank name are required' });
    }

    // Find the bank details based on loan_type and bank_name (case-insensitive match)
    const bankDetail = await bank_details.findOne({
      Loan_Type: { $regex: new RegExp(`^${loan_type}$`, 'i') },  // Case-insensitive match for loan_type
      Bank_Name: { $regex: new RegExp(`^${bank_name}$`, 'i') }   // Case-insensitive match for bank_name
    });

    // If no matching bank is found
    if (!bankDetail) {
      return res.status(404).json({ message: 'Bank not found' });
    }

    // Return the bank details
    return res.status(200).json({
      bankDetail
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};


const getDocumentList = async (req, res) => {
  try {
    const { type_of_loan,
      loan_category} = req.body;
    if (!type_of_loan || !loan_category) {
      return res.status(400).json({ error: 'Type_of_loan and Loan_category are required' });
    }
    const documentData = await documents.find({ type_of_loan,
      loan_category}).select('Document');
    if (!documentData || documentData.length === 0) {
      return res.status(404).json({ message: 'Documents not found' });
    }
    const documentList = documentData.flatMap(doc => doc.Document);
    return res.status(200).json({ documents: documentList });
  } catch (error) {
    console.error('Error retrieving document list:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};


const getBankNames = async (req, res) => {
  const { Loan_Type } = req.body;
  try {
    const Documents = await bank_details.find({ Loan_Type }).select('Bank_Name -_id');
    if (Documents.length === 0) {
      return res.status(404).json({ success: false, message: 'No documents found for this Loan_Type' });
    }
    const bankNames = [...new Set(Documents.map(doc => doc.Bank_Name))];
    res.status(200).json({ success: true, bankNames });
  } catch (error) {
    console.error('Error fetching bank names:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getlist = async (req, res) => {
  try {
    const Documents = await bank_details.find().select('Bank_Name -_id');
    if (Documents.length === 0) {
      return res.status(404).json({ success: false, message: 'No documents found for this Loan_Type' });
    }
    const bankNames = [...new Set(Documents.map(doc => doc.Bank_Name))];
    res.status(200).json({ success: true, bankNames });
  } catch (error) {
    console.error('Error fetching bank names:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


const createBankDetail = async (req, res) => {
  try {
    const {
      userId,
      file_number,
      bank_login_status,
      call_status,
      reason_for_notlogin,
      loan_type,
      bank_name,
      rm1_name,
      rm1_contact_number,
      rm2_name,
      rm2_contact_number,
      email_1,
      email_2,
      document_status,
      remarks
    } = req.body;

    // If bank_login_status is "No", call_status, reason_for_notlogin, and remarks are required
    if (bank_login_status === 'No') {
      if (!call_status || !reason_for_notlogin || !remarks) {
        return res.status(400).json({
          error: 'For bank login status "No", call status, reason for not login, and remarks are required.'
        });
      }
    }

    // If bank_login_status is "Yes", the following fields are required
    if (bank_login_status === 'Yes') {
      if (!bank_name || !rm1_name || !rm1_contact_number || !email_1 || !document_status || !remarks) {
        return res.status(400).json({
          error: 'For bank login status "Yes", bank name, RM1 details, RM2 details, emails, document status, and remarks are required.'
        });
      }
    }

    // Create a new BankDetail entry
    const bankDetail = new banklogin_details({
      userId,
      file_number,
      bank_login_status,
      call_status: bank_login_status === 'No' ? call_status : '',
      reason_for_notlogin: bank_login_status === 'No' ? reason_for_notlogin : '',
      loan_type,
      bank_name: bank_login_status === 'Yes' ? bank_name : '',
      rm1_name: bank_login_status === 'Yes' ? rm1_name : '',
      rm1_contact_number: bank_login_status === 'Yes' ? rm1_contact_number : '',
      rm2_name: bank_login_status === 'Yes' ? rm2_name : '',
      rm2_contact_number: bank_login_status === 'Yes' ? rm2_contact_number : '',
      email_1: bank_login_status === 'Yes' ? email_1 : '',
      email_2: bank_login_status === 'Yes' ? email_2 : '',
      document_status: bank_login_status === 'Yes' ? document_status : 'Not Ready',
      remarks
    });

    // Save the bank details to the database
    await bankDetail.save();

    return res.status(201).json({
      message: 'Bank details saved successfully',
      bankDetail
    });
  } catch (error) {
    console.error('Error saving bank details:', error);
    return res.status(500).json({
      error: 'Server error, please try again later.'
    });
  }
};


const getbanklogindetails = async (req, res) => {
  // Correctly extract userId from req.params
  const { file_number } = req.params;
  
  try {
      // Fetch bank login details using userId
      const bankLoginDetails = await banklogin_details.find({ file_number: file_number });
      
      if (bankLoginDetails.length === 0) {
          return res.status(404).json({ message: 'No records found' });
      }
      
      res.status(200).json(bankLoginDetails);
  } catch (error) {
      res.status(500).json({ message: 'Error retrieving records', error: error.message });
  }
};


module.exports = {
    get_rmDetails,
    getDocumentList,
    getBankNames,
    getlist,
    createBankDetail,
    getbanklogindetails
  };