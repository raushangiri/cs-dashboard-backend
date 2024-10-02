const auto_loan_file = require("../../model/auto_loan_file.model");
const personal_details_model = require('../../model/personaldetails.model');  // Your model
const loanfilemodel = require('../../model/loan_file.model'); // Assuming your model is in the same folder
const user = require('../../model/user.model'); // Assuming your model is in the same folder


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


 const pendingcount= async (req, res) => {
  try {
    // Aggregate to count pending statuses
    const pendingCounts = await loanfilemodel.aggregate([
      {
        $match: {
          $or: [
            { sales_status: "Interested" },
            { tvr_status: "Pending" },
            { cdr_status: "Pending" },
            { backlogin_status: "Pending" }
          ]
        }
      },
      {
        $group: {
          _id: null,
          salesCount: { $sum: { $cond: [{ $eq: ["$sales_status", "Interested"] }, 1, 0] } },
          tvrCount: { $sum: { $cond: [{ $eq: ["$tvr_status", "Pending"] }, 1, 0] } },
          cdrCount: { $sum: { $cond: [{ $eq: ["$cdr_status", "Pending"] }, 1, 0] } },
          backloginCount: { $sum: { $cond: [{ $eq: ["$backlogin_status", "Pending"] }, 1, 0] } }
        }
      }
    ]);

    if (pendingCounts.length === 0) {
      return res.status(200).json({ message: "No pending statuses found", data: [] });
    }

    // Format the response data for the pie chart
    const responseData = [
      { data: 'Interested', count: pendingCounts[0].salesCount },
      { data: 'TVR Pending', count: pendingCounts[0].tvrCount },
      { data: 'CDR Pending', count: pendingCounts[0].cdrCount },
      { data: 'Banklogin Pending', count: pendingCounts[0].backloginCount }
    ];

    // Return the formatted counts
    res.status(200).json({ status: 200, data: responseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getTeamLeadersAndReporters = async (req, res) => {
  try {
    // Step 1: Fetch all user IDs where role is 'Team Leader'
    const teamLeaders = await user.find({ role: 'Team leader' }, 'userId'); // Fetch only the _id field
    const teamLeaderIds = teamLeaders.map(leader => leader.userId); // Extract array of _id

    // Step 2: Fetch all users who report to the team leaders
    const reporters = await user.find({ reportingTo: { $in: teamLeaderIds } }, 'userId'); // Users reporting to team leaders
    const reporterIds = reporters.map(reporter => reporter.userId); // Extract array of _id

    // Step 3: Send response with both team leaders and reporters
    return res.json({
      success: true,
      teamLeaderIds,
      reporterIds,
    });
  } catch (error) {
    console.error('Error fetching team leaders and reporters:', error);
    return res.status(500).json({ error: 'Server error while fetching data' });
  }
};


module.exports = {
    typeofloanreport,
    pendingcount,
    getTeamLeadersAndReporters
}