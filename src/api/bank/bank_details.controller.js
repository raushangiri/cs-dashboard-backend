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
    const { Type_of_loan, Loan_category } = req.body;
    if (!Type_of_loan || !Loan_category) {
      return res.status(400).json({ error: 'Type_of_loan and Loan_category are required' });
    }
    const documentData = await documents.find({ Type_of_loan, Loan_category }).select('Document');
    if (!documentData || documentData.length === 0) {
      return res.status(404).json({ message: 'Documents not found for the given Type_of_loan and Loan_category' });
    }
    const documentList = documentData.flatMap(doc => doc.Document);
    return res.status(200).json({ documents: documentList });
  } catch (error) {
    console.error('Error retrieving document list:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
    get_rmDetails,
    getDocumentList
  };