const auto_loan_file = require("../../model/auto_loan_file.model");
const personal_details_model = require('../../model/personaldetails.model');  // Your model


const typeofloanreport= async (req, res) => {
    try {
      const loanCounts = await personal_details_model.aggregate([
        {
          $group: {
            _id: "$type_of_loan",
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            type_of_loan: "$_id",
            count: 1
          }
        }
      ]);
  
      res.status(200).json(loanCounts);
    } catch (error) {
      console.error('Error fetching loan counts:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };


module.exports = {
    typeofloanreport
}