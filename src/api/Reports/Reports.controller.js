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


const tvrreport= async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Ensure startDate and endDate are provided
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required.',
      });
    }

    // Find loan files where tvr_agent_id exists and filter by tvr_assign_date within date range
    const loanFiles = await loanfilemodel.find({
      tvr_agent_id: { $exists: true, $ne: ""  },
      tvr_assign_date: {
        $gte: new Date(startDate), // Filter from startDate
        $lte: new Date(endDate),   // Filter to endDate
      },
    }).select('customer_name customer_mobile_number tvr_agent_id tvr_status tvr_agent_name tvr_assign_date');

    // Process each loan file to find team leader details
    const result = await Promise.all(loanFiles.map(async (loanFile) => {
      // Find the user (agent) with tvr_agent_id
      const agent = await user.findOne({ userId: loanFile.tvr_agent_id });

      // Find the team leader based on the reportingTo value
      let teamLeader = null;
      if (agent && agent.reportingTo) {
        teamLeader = await user.findOne({ userId: agent.reportingTo });
      }
      const tvrAssignDate = new Date(loanFile.tvr_assign_date);
      const date = tvrAssignDate.toLocaleDateString('Gn-US');

// Extract the time (e.g., "10:30 AM")
const time = tvrAssignDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

// console.log(date); // Outputs something like "10/3/2024"
// console.log(time);
      // Return loan file details along with team leader info
      return {
        teamleaderid: teamLeader ? teamLeader.userId : null,
        teamleadername: teamLeader ? teamLeader.name : null,
        tvr_agent_id: loanFile.tvr_agent_id,
        tvr_agent_name: loanFile.tvr_agent_name,
        tvr_status: loanFile.tvr_status,
        customer_name: loanFile.customer_name,
        customer_mobile_number: loanFile.customer_mobile_number,
        tvr_assign_date:date,
        time: time
      };
    }));

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching loan files:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};

const cdrreport= async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Ensure startDate and endDate are provided
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required.',
      });
    }

    // Find loan files where tvr_agent_id exists and filter by tvr_assign_date within date range
    const loanFiles = await loanfilemodel.find({
      cdr_agent_id: { $exists: true, $ne: ""  },
      cdr_assign_date: {
        $gte: new Date(startDate), // Filter from startDate
        $lte: new Date(endDate),   // Filter to endDate
      },
    }).select('customer_name customer_mobile_number cdr_agent_id cdr_status cdr_agent_name cdr_assign_date');

    // Process each loan file to find team leader details
    const result = await Promise.all(loanFiles.map(async (loanFile) => {
      // Find the user (agent) with cdr_agent_id
      const agent = await user.findOne({ userId: loanFile.cdr_agent_id });

      // Find the team leader based on the reportingTo value
      let teamLeader = null;
      if (agent && agent.reportingTo) {
        teamLeader = await user.findOne({ userId: agent.reportingTo });
      }
      const cdrAssignDate = new Date(loanFile.cdr_assign_date);
      const date = cdrAssignDate.toLocaleDateString('Gn-US');

// Extract the time (e.g., "10:30 AM")
const time = cdrAssignDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

// console.log(date); // Outputs something like "10/3/2024"
// console.log(time);
      // Return loan file details along with team leader info
      return {
        teamleaderid: teamLeader ? teamLeader.userId : null,
        teamleadername: teamLeader ? teamLeader.name : null,
        cdr_agent_id: loanFile.cdr_agent_id,
        cdr_agent_name: loanFile.cdr_agent_name,
        cdr_status: loanFile.cdr_status,
        customer_name: loanFile.customer_name,
        customer_mobile_number: loanFile.customer_mobile_number,
        cdr_assign_date:date,
        time: time
      };
    }));

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching loan files:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};

const loginreport= async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Ensure startDate and endDate are provided
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required.',
      });
    }

    // Find loan files where tvr_agent_id exists and filter by tvr_assign_date within date range
    const loanFiles = await loanfilemodel.find({
      banklogin_agent_id: { $exists: true, $ne: ""  },
      banklogin_assign_date: {
        $gte: new Date(startDate), // Filter from startDate
        $lte: new Date(endDate),   // Filter to endDate
      },
    }).select('banklogin_assign_date customer_name customer_mobile_number banklogin_agent_id banklogin_status banklogin_agent_name ');

    // Process each loan file to find team leader details
    const result = await Promise.all(loanFiles.map(async (loanFile) => {
      // Find the user (agent) with cdr_agent_id
      const agent = await user.findOne({ userId: loanFile.banklogin_agent_id });

      // Find the team leader based on the reportingTo value
      let teamLeader = null;
      if (agent && agent.reportingTo) {
        teamLeader = await user.findOne({ userId: agent.reportingTo });
      }
      const bankloginAssignDate = new Date(loanFile.banklogin_assign_date);
      const date = bankloginAssignDate.toLocaleDateString('Gn-US');

// Extract the time (e.g., "10:30 AM")
const time = bankloginAssignDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

// console.log(date); // Outputs something like "10/3/2024"
// console.log(time);
      // Return loan file details along with team leader info
      return {
        teamleaderid: teamLeader ? teamLeader.userId : null,
        teamleadername: teamLeader ? teamLeader.name : null,
        banklogin_agent_id: loanFile.banklogin_agent_id,
        banklogin_agent_name: loanFile.banklogin_agent_name,
        banklogin_status: loanFile.banklogin_status,
        customer_name: loanFile.customer_name,
        customer_mobile_number: loanFile.customer_mobile_number,
        banklogin_assign_date:date,
        time: time
      };
    }));

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching loan files:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};


module.exports = {
    typeofloanreport,
    pendingcount,
    getTeamLeadersAndReporters,
    tvrreport,
    cdrreport,
    loginreport
}