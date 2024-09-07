const bank_details = require("../../model/bank.model");
const documents = require("../../model/document.model");


const get_rmDetails = async (req, res) => {
  try {
    const { bank_Name } = req.body;  
    if (!bank_Name) {
      return res.status(400).json({ error: 'Bank name is required' });
    }
    const bankDetail = await bank_details.findOne({ Bank_Name: { $regex: new RegExp(`^${bank_Name}$`, 'i') } });
    if (!bankDetail) {
      return res.status(404).json({ message: 'Bank not found' });
    }
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


module.exports = {
    get_rmDetails,
    getDocumentList,
    getBankNames,
    getlist
  };