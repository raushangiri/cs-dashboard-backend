const bank_details = require("../../model/bank.model");


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



module.exports = {
    get_rmDetails,
  };