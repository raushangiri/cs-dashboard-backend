const bank_details = require("../../model/bank.model");
const documents = require("../../model/document.model");
const banklogin_details = require("../../model/banklogin.model");
const createbank_details = require("../../model/bank.model");

const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const https = require('https');

const fileUrl = 'https://firebasestorage.googleapis.com/v0/b/jbj-fintech.appspot.com/o/eel_api_docs.xlsx?alt=media';
const filePath = './document.pdf';



const createbankmaster =async (req, res) => {
  try {
    const {
      Loan_Type,
      Bank_Name,
      rm1_name,
      rm1_contact_number,
      rm2_name,
      rm2_contact_number,
      email_1,
      email_2,
      email_3,
    } = req.body;
console.log(req.body);
    const newBank = new createbank_details({
      Loan_Type,
      Bank_Name,
      rm1_name,
      rm1_contact_number,
      rm2_name,
      rm2_contact_number,
      email_1,
      email_2,
      email_3,
    });
    await newBank.save();
    res.status(201).json({
      success: true,
      message: "Bank details added successfully",
      data: newBank,
    });
  } catch (err) {
    console.error("Error adding bank details:", err.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
}

const updatebankmaster= async (req, res) => {
  try {
    const {
      id,
      rm1_name,
      rm1_contact_number,
      rm2_name,
      rm2_contact_number,
      email_1,
      email_2,
      email_3,
    } = req.body;
// console.log(req.body,"body");
    const updatedBank = await createbank_details.findByIdAndUpdate(
      id,
      {
        $set: {
          rm1_name,
          rm1_contact_number,
          rm2_name,
          rm2_contact_number,
          email_1,
          email_2,
          email_3,
        },
      },
      { new: true } 
    );

    if (!updatedBank) {
      return res.status(404).json({ message: "Bank not found" });
    }

    res.json({
      message: "Bank RM information updated successfully",
      bankDetail: updatedBank,
    });
  } catch (err) {
    console.error("Error updating RM info:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
}

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
    if (bank_login_status === 'No') {
      if (!call_status || !reason_for_notlogin || !remarks) {
        return res.status(400).json({
          error: 'For bank login status "No", call status, reason for not login, and remarks are required.'
        });
      }
    }
    if (bank_login_status === 'Yes') {
      if (!bank_name || !rm1_name || !rm1_contact_number || !email_1 || !document_status || !remarks) {
        return res.status(400).json({
          error: 'For bank login status "Yes", bank name, RM1 details, RM2 details, emails, document status, and remarks are required.'
        });
      }
    }
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

const deleteBankDetail = async (req, res) => {
  try {
    const { _id } = req.params;

    // Find and delete the bank detail by id
    const deletedBankDetail = await banklogin_details.findByIdAndDelete(_id);

    // If the bank detail does not exist
    if (!deletedBankDetail) {
      return res.status(404).json({
        message: 'Bank detail not found'
      });
    }

    return res.status(200).json({
      message: 'Bank detail deleted successfully',
      deletedBankDetail
    });
  } catch (error) {
    console.error('Error deleting bank detail:', error);
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



const downloadFile = (url, downloadPath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(downloadPath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(downloadPath));
      });
    }).on('error', (err) => {
      fs.unlink(downloadPath, () => reject(err.message)); // Cleanup on error
    });
  });
};

// Helper function to send the email with attachments
const sendEmailWithAttachment = (email, subject, text, attachments, cc) => {
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: Array.isArray(email) ? email.join(", ") : email,  // Handles multiple recipients
      cc: Array.isArray(cc) ? cc.join(", ") : cc,           // Handles multiple CC recipients
      subject: subject,
      text: text,
      attachments: attachments.map(filePath => ({
        filename: path.basename(filePath),
        path: filePath,
      })),
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return reject(err);
      }
      resolve(info);
    });
  });
};

const sendDocumentEmail = async (req, res) => {
  const { email, subject, text, documentUrls, documentNames, cc, _id } = req.body;
  if (!email || !subject || !text || !documentUrls || !documentUrls.length || !documentNames || !documentNames.length || !_id) {
    return res.status(400).json({ error: 'All fields are required: email, subject, text, documentUrls, documentNames, _id' });
  }
  const tempFilePaths = [];
  try {
    for (let i = 0; i < documentUrls.length; i++) {
      const documentUrl = documentUrls[i];
      const documentName = documentNames[i];
      const tempFilePath = path.join(__dirname, '../temp', documentName); 
      await downloadFile(documentUrl, tempFilePath);
      tempFilePaths.push(tempFilePath);
    }
    const emailInfo = await sendEmailWithAttachment(email, subject, text, tempFilePaths, cc);
    await banklogin_details.updateOne(
      { _id }, 
      { $set: { document_status: 'document shared' } }
    );
    tempFilePaths.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
    res.json({
      message: 'Email sent successfully and document status updated!',
      info: emailInfo,
    });
  } catch (error) {
    tempFilePaths.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
    res.status(500).json({
      error: 'Error sending email, updating status, or downloading file',
      details: error.message,
    });
  }
};



module.exports = {
    get_rmDetails,
    getDocumentList,
    getBankNames,
    getlist,
    createBankDetail,
    getbanklogindetails,
    sendDocumentEmail,
    deleteBankDetail,
    createbankmaster,
    updatebankmaster
    };



    
// const sendEmailWithAttachment = async (req, res) => {
//   try {
//     // Extract user details and document link from the request body
//     const { email, subject, text, attachmentUrl, userName, userPhone } = req.body;

//     // Create a transporter (this is using Gmail; adjust for your service)
//     let transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USERNAME, // Your email address
//         pass: process.env.EMAIL_PASSWORD, // Your email password or app password if 2FA is on
//       },
//     });

//     // Define the email options
//     let mailOptions = {
//       from: `"Your App Name" <${process.env.EMAIL_USERNAME}>`, // Sender address
//       to: email, // Receiver's email address
//       subject: subject || 'Document Attached', // Email subject
//       text: text || `Hello, please find the attached document for review.`, // Email body text
//       html: `<p>Dear ${userName},</p><p>Please find the attached document. You can contact me at ${userPhone} for any further queries.</p>`, // Email body with HTML
//       attachments: [
//         {
//           filename: 'document.pdf', // Name of the file to be attached
//           path: attachmentUrl, // URL or path to the file to attach
//         },
//       ],
//     };

//     // Send email
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.log('Error sending email:', error);
//         return res.status(500).json({ message: 'Error sending email', error });
//       }
//       console.log('Email sent successfully:', info.response);
//       return res.status(200).json({ message: 'Email sent successfully', info });
//     });
//   } catch (error) {
//     console.error('Error in sendEmailWithAttachment function:', error);
//     return res.status(500).json({ message: 'Internal Server Error', error });
//   }
// };


// const sendEmailWithAttachment = (email, subject, text, attachments, cc) => {
//   return new Promise((resolve, reject) => {
//     let transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });

//     let mailOptions = {
//       from: process.env.EMAIL_USERNAME,
//       to: Array.isArray(email) ? email.join(", ") : email,  // Handles multiple recipients
//       cc: Array.isArray(cc) ? cc.join(", ") : cc,           // Handles multiple CC recipients
//       subject: subject,
//       text: text,
//       attachments: attachments.map(attachment => ({
//         filename: attachment.filename,  // Directly use the filename from the frontend
//         path: attachment.path,          // Use the path as passed from the frontend (URL or file path)
//       })),
//     };

//     transporter.sendMail(mailOptions, (err, info) => {
//       if (err) {
//         return reject(err);
//       }
//       resolve(info);
//     });
//   });
// };


// API function (controller)
// const sendDocumentEmail = async (req, res) => {
//   const { email, subject, text, documentUrls, documentNames, cc,_id } = req.body;

//   // Ensure the required fields are present
//   if (!email || !subject || !text || !documentUrls || !documentUrls.length || !documentNames || !documentNames.length || _id) {
//     return res.status(400).json({ error: 'All fields are required: email, subject, text, documentUrls, documentNames' });
//   }

//   // Temporary file paths array for multiple attachments
//   const tempFilePaths = [];

//   try {
//     // Step 1: Download all documents
//     for (let i = 0; i < documentUrls.length; i++) {
//       const documentUrl = documentUrls[i];
//       const documentName = documentNames[i]; // Get the document name from the request
//       const tempFilePath = path.join(__dirname, '../temp', documentName); // Use documentName as the filename
//       await downloadFile(documentUrl, tempFilePath);
//       tempFilePaths.push(tempFilePath); // Save the file path for attachment
//     }

//     // Step 2: Send the email with multiple attachments
//     const emailInfo = await sendEmailWithAttachment(email, subject, text, tempFilePaths, cc);

//     // Step 3: Clean up by removing the downloaded files
//     tempFilePaths.forEach(filePath => {
//       if (fs.existsSync(filePath)) {
//         fs.unlinkSync(filePath);
//       }
//     });

//     // Success response
//     res.json({
//       message: 'Email sent successfully!',
//       info: emailInfo,
//     });
//   } catch (error) {
//     // Cleanup in case of failure
//     tempFilePaths.forEach(filePath => {
//       if (fs.existsSync(filePath)) {
//         fs.unlinkSync(filePath);
//       }
//     });

//     // Error response
//     res.status(500).json({
//       error: 'Error sending email or downloading file',
//       details: error.message,
//     });
//   }
// };

