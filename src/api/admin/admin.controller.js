const auto_loan_file = require("../../model/auto_loan_file.model");
const personal_details_model = require('../../model/personaldetails.model');  // Your model
const loanfilemodel = require('../../model/loan_file.model'); // Assuming your model is in the same folder
const user = require('../../model/user.model'); // Assuming your model is in the same folder
const overview_details = require("../../model/overview.model");


const getLoanFilesByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Check if dates are provided
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required.' });
    }

    // Convert the received dates to ISO format with time included
    const startOfDay = new Date(new Date(startDate).setHours(0, 0, 0, 0)); // 12:00 AM of startDate
    const endOfDay = new Date(new Date(endDate).setHours(23, 59, 59, 999)); // 11:59:59 PM of endDate

    // Query the database
    const loanFiles = await loanfilemodel.find({
      sales_assign_date: {
        $gte: startOfDay, // Greater than or equal to the start of the day
        $lte: endOfDay,   // Less than or equal to the end of the day
      }
    });

    // Return the loan files
    if (loanFiles.length > 0) {
      res.status(200).json({ status: 200, data: loanFiles });
    } else {
      res.status(404).json({ status: 404, message: 'No loan files found for the given date range.' });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Server error', error: error.message });
  }
};

const gettvrFilesByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required.' });
    }

    const startOfDay = new Date(new Date(startDate).setHours(0, 0, 0, 0));
    const endOfDay = new Date(new Date(endDate).setHours(23, 59, 59, 999));

    const loanFiles = await loanfilemodel.find({
      tvr_assign_date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (loanFiles.length > 0) {
      const enrichedLoanFiles = await Promise.all(
        loanFiles.map(async (loanFile) => {
          const loanfiledata = await personal_details_model.findOne({ file_number: loanFile.file_number });
          const overview_detail = await overview_details.findOne({ file_number: loanFile.file_number });

          console.log(loanfiledata.type_of_loan,"type_of_loan")
          if (!loanFile.tvr_agent_id) {
            return {
              ...loanFile.toObject(),
              teamleadername: null,
              teamleaderuserid: null,
              tvr_agent_id: null,
              tvr_agent_name: loanfiledata.tvr_agent_name,
              type_of_loan: overview_detail.type_of_loan,
            };
          }

          const agent = await user.findOne({ userId: loanFile.tvr_agent_id });

          if (agent && agent.reportingTo) {
            const teamLeader = await user.findOne({ userId: agent.reportingTo });

            if (teamLeader) {
              return {
                ...loanFile.toObject(),
                teamleadername: teamLeader.name,
                teamleaderuserid: teamLeader.userId,
              };
            } else {
              console.log(`No team leader found for agent ${agent.userId}`);
            }
          } else {
            console.log(`No agent or reportingTo found for loan file: ${loanFile._id}`);
          }

          return {
            ...loanFile.toObject(),
            teamleadername: "Pending",
            teamleaderuserid: null,
          };
        })
      );

      res.status(200).json({ status: 200, data: enrichedLoanFiles });
    } else {
      res.status(404).json({ status: 404, message: 'No loan files found for the given date range.' });
    }
  } catch (error) {
    console.error('Error fetching loan files:', error);
    res.status(500).json({ status: 500, message: 'Server error', error: error.message });
  }
};


const getcdrFilesByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Check if dates are provided
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required.' });
    }

    // Convert the received dates to ISO format with time included
    const startOfDay = new Date(new Date(startDate).setHours(0, 0, 0, 0)); // 12:00 AM of startDate
    const endOfDay = new Date(new Date(endDate).setHours(23, 59, 59, 999)); // 11:59:59 PM of endDate

    // Step 1: Query loanfilemodel collection based on tvr_assign_date
    const loanFiles = await loanfilemodel.find({
      cdr_assign_date: {
        $gte: startOfDay, // Greater than or equal to the start of the day
        $lte: endOfDay,   // Less than or equal to the end of the day
      }
    });

    // Step 2: If loan files found, proceed to enrich with team leader info
    if (loanFiles.length > 0) {

      const enrichedLoanFiles = await Promise.all(
        loanFiles.map(async (loanFile) => {
          const loanfiledata = await personal_details_model.findOne({ file_number: loanFile.file_number });

          // If there's no tvr_agent_id, return "Pending" for agent name and proceed
          if (!loanFile.cdr_agent_id) {
            return {
              ...loanFile.toObject(),
              teamleadername: null,
              teamleaderuserid: null,
              cdr_agent_id:null,
              cdr_agent_name:"Pending",
              type_of_loan:loanfiledata.type_of_loan

            };
          }

          // Find the user (agent) by cdr_agent_id (which is stored as userId in UserModel)
          const agent = await user.findOne({ userId: loanFile.cdr_agent_id });

          // If the agent exists, find the team leader using the reportingTo field
          if (agent && agent.reportingTo) {
            const teamLeader = await user.findOne({ userId: agent.reportingTo });

            // If team leader is found, enrich the loan file with their details
            if (teamLeader) {
              return {
                ...loanFile.toObject(),  // Convert Mongoose document to plain object
                teamleadername: teamLeader.name,
                teamleaderuserid: teamLeader.userId,
                type_of_loan:loanfiledata.type_of_loan
              };
            }
          }
          // If no team leader is found, return loan file with agent's information
          return {
            ...loanFile.toObject(),
            teamleadername: "Pending",
            teamleaderuserid: null,
            type_of_loan:loanfiledata.type_of_loan
          };
        })
      );

      // Step 3: Return the enriched loan files
      res.status(200).json({ status: 200, data: enrichedLoanFiles });
    } else {
      res.status(404).json({ status: 404, message: 'No loan files found for the given date range.' });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Server error', error: error.message });
  }
};

const getbankloginFilesByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Check if dates are provided
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required.' });
    }

    // Convert the received dates to ISO format with time included
    const startOfDay = new Date(new Date(startDate).setHours(0, 0, 0, 0)); // 12:00 AM of startDate
    const endOfDay = new Date(new Date(endDate).setHours(23, 59, 59, 999)); // 11:59:59 PM of endDate

    // Step 1: Query loanfilemodel collection based on tvr_assign_date
    const loanFiles = await loanfilemodel.find({
      banklogin_assign_date: {
        $gte: startOfDay, // Greater than or equal to the start of the day
        $lte: endOfDay,   // Less than or equal to the end of the day
      }
    });

    // Step 2: If loan files found, proceed to enrich with team leader info
    if (loanFiles.length > 0) {

      const enrichedLoanFiles = await Promise.all(
        loanFiles.map(async (loanFile) => {
          const loanfiledata = await personal_details_model.findOne({ file_number: loanFile.file_number });

          // If there's no tvr_agent_id, return "Pending" for agent name and proceed
          if (!loanFile.banklogin_agent_id) {
            return {
              ...loanFile.toObject(),
              teamleadername: null,
              teamleaderuserid: null,
              banklogin_agent_id:null,
              banklogin_agent_name:"Pending",
              type_of_loan:loanfiledata.type_of_loan

            };
          }

          // Find the user (agent) by banklogin_agent_id (which is stored as userId in UserModel)
          const agent = await user.findOne({ userId: loanFile.banklogin_agent_id });

          // If the agent exists, find the team leader using the reportingTo field
          if (agent && agent.reportingTo) {
            const teamLeader = await user.findOne({ userId: agent.reportingTo });

            // If team leader is found, enrich the loan file with their details
            if (teamLeader) {
              return {
                ...loanFile.toObject(),  // Convert Mongoose document to plain object
                teamleadername: teamLeader.name,
                teamleaderuserid: teamLeader.userId,
                type_of_loan:loanfiledata.type_of_loan
              };
            }
          }
          // If no team leader is found, return loan file with agent's information
          return {
            ...loanFile.toObject(),
            teamleadername: "Pending",
            teamleaderuserid: null,
            type_of_loan:loanfiledata.type_of_loan
          };
        })
      );

      // Step 3: Return the enriched loan files
      res.status(200).json({ status: 200, data: enrichedLoanFiles });
    } else {
      res.status(404).json({ status: 404, message: 'No loan files found for the given date range.' });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Server error', error: error.message });
  }
};

const gettvrperformanceByFilters = async (req, res) => {
  try {
    const { startDate, endDate, teamLeaderName, tvrAgentName } = req.query;

    // Build the query object based on provided filters
    let query = {};

    // Handle date range filter
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0); // Start of the day

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of the day

      query.tvr_assign_date = {
        $gte: start,
        $lte: end
      };
    }

    // Fetch sales agent details if salesAgentName is provided
    if (tvrAgentName) {
      const agents = await user.find({ name: tvrAgentName }, 'userId'); // Fetch userIds matching the sales agent's name
      const agentIds = agents.map(agent => agent.userId);

      if (agentIds.length > 0) {
        query.tvr_agent_id = { $in: agentIds }; // Add filter for sales_agent_id
      } else {
        return res.status(404).json({
          success: false,
          message: 'No sales agent found with the provided name',
        });
      }
    }

    // Fetch team leader details if teamLeaderName is provided
    if (teamLeaderName) {
      const teamLeaders = await user.find({ name: teamLeaderName }, 'userId'); // Fetch userIds matching the team leader's name
      const leaderIds = teamLeaders.map(leader => leader.userId);

      if (leaderIds.length > 0) {
        // Fetch sales agents reporting to this team leader
        const agents = await user.find({ reportingTo: { $in: leaderIds } }, 'userId');
        const agentIds = agents.map(agent => agent.userId);

        if (agentIds.length > 0) {
          query.sales_agent_id = { $in: agentIds }; // Add filter for sales_agent_id
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

    // Fetch filtered loan files from the database
    const loanFiles = await loanfilemodel.find(query).sort({ tvr_assign_date: -1 });

    if (loanFiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No loan files found for the selected filters',
      });
    }

    // Get unique sales_agent_ids
    const tvrAgentIds = [...new Set(loanFiles.map(file => file.tvr_agent_id))];

    // Fetch users whose userId matches salesAgentIds
    const users = await user.find({ userId: { $in: tvrAgentIds } }, 'userId name reportingTo');

    // Create a mapping of sales_agent_id to name and reportingTo user IDs
    const tvrAgentMap = {};
    users.forEach(user => {
      tvrAgentMap[user.userId] = {
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
    const response = tvrAgentIds.map(agentId => {
      const loanFilesForAgent = loanFiles.filter(file => file.tvr_agent_id === agentId);

      
     

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
        tvr_agent_id: agentId,
        tvr_agent_name: tvrAgentMap[agentId]?.name || 'Pending',
        teamLeaderName: reportingToNameMap[tvrAgentMap[agentId]?.reportingTo] || '',
       
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

const getcdrperformanceByFilters = async (req, res) => {
  try {
    const { startDate, endDate, teamLeaderName, cdrAgentName } = req.query;

    // Build the query object based on provided filters
    let query = {};

    // Handle date range filter
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0); // Start of the day

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of the day

      query.cdr_assign_date = {
        $gte: start,
        $lte: end
      };
    }

    // Fetch sales agent details if salesAgentName is provided
    if (cdrAgentName) {
      const agents = await user.find({ name: cdrAgentName }, 'userId'); // Fetch userIds matching the sales agent's name
      const agentIds = agents.map(agent => agent.userId);

      if (agentIds.length > 0) {
        query.cdr_agent_id = { $in: agentIds }; // Add filter for sales_agent_id
      } else {
        return res.status(404).json({
          success: false,
          message: 'No sales agent found with the provided name',
        });
      }
    }

    // Fetch team leader details if teamLeaderName is provided
    if (teamLeaderName) {
      const teamLeaders = await user.find({ name: teamLeaderName }, 'userId'); // Fetch userIds matching the team leader's name
      const leaderIds = teamLeaders.map(leader => leader.userId);

      if (leaderIds.length > 0) {
        // Fetch sales agents reporting to this team leader
        const agents = await user.find({ reportingTo: { $in: leaderIds } }, 'userId');
        const agentIds = agents.map(agent => agent.userId);

        if (agentIds.length > 0) {
          query.sales_agent_id = { $in: agentIds }; // Add filter for sales_agent_id
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

    // Fetch filtered loan files from the database
    const loanFiles = await loanfilemodel.find(query).sort({ cdr_assign_date: -1 });

    if (loanFiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No loan files found for the selected filters',
      });
    }

    // Get unique sales_agent_ids
    const cdrAgentIds = [...new Set(loanFiles.map(file => file.cdr_agent_id))];

    // Fetch users whose userId matches salesAgentIds
    const users = await user.find({ userId: { $in: cdrAgentIds } }, 'userId name reportingTo');

    // Create a mapping of sales_agent_id to name and reportingTo user IDs
    const cdrAgentMap = {};
    users.forEach(user => {
      cdrAgentMap[user.userId] = {
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
    const response = cdrAgentIds.map(agentId => {
      const loanFilesForAgent = loanFiles.filter(file => file.cdr_agent_id === agentId);

    
      const cdrPendingCount = loanFilesForAgent.filter(file => file.cdr_status === 'Pending').length;
      const cdrCompletedCount = loanFilesForAgent.filter(file => file.cdr_status === 'Completed').length;
      const cdrRejectedCount = loanFilesForAgent.filter(file => file.cdr_status === 'Rejected').length;
      const bankLoginCount = loanFilesForAgent.filter(file => file.banklogin_status === 'Completed').length;

      const approvalPendingCount = loanFilesForAgent.filter(file => file.approval_status === 'Pending').length;
      const approvalCompletedCount = loanFilesForAgent.filter(file => file.approval_status === 'Completed').length;

      const disbursalPendingCount = loanFilesForAgent.filter(file => file.disbursal_status === 'Pending').length;
      const disbursalCompletedCount = loanFilesForAgent.filter(file => file.disbursal_status === 'Completed').length;

      // Prepare the details for this sales agent
      return {
        cdr_agent_id: agentId,
        cdr_agent_name: cdrAgentMap[agentId]?.name || 'Pending',
        teamLeaderName: reportingToNameMap[cdrAgentMap[agentId]?.reportingTo] || '',
       
      
        cdrPending: cdrPendingCount,
        cdrCompleted: cdrCompletedCount,
        cdrRejectedCount:cdrRejectedCount,
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

const getbankloginperformanceByFilters = async (req, res) => {
  try {
    const { startDate, endDate, teamLeaderName, bankloginAgentName } = req.query;

    // Build the query object based on provided filters
    let query = {};

    // Handle date range filter
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0); // Start of the day

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of the day

      query.banklogin_assign_date = {
        $gte: start,
        $lte: end
      };
    }

    // Fetch sales agent details if salesAgentName is provided
    if (bankloginAgentName) {
      const agents = await user.find({ name: bankloginAgentName }, 'userId'); // Fetch userIds matching the sales agent's name
      const agentIds = agents.map(agent => agent.userId);

      if (agentIds.length > 0) {
        query.banklogin_agent_id = { $in: agentIds }; // Add filter for sales_agent_id
      } else {
        return res.status(404).json({
          success: false,
          message: 'No sales agent found with the provided name',
        });
      }
    }

    // Fetch team leader details if teamLeaderName is provided
    if (teamLeaderName) {
      const teamLeaders = await user.find({ name: teamLeaderName }, 'userId'); // Fetch userIds matching the team leader's name
      const leaderIds = teamLeaders.map(leader => leader.userId);

      if (leaderIds.length > 0) {
        // Fetch sales agents reporting to this team leader
        const agents = await user.find({ reportingTo: { $in: leaderIds } }, 'userId');
        const agentIds = agents.map(agent => agent.userId);

        if (agentIds.length > 0) {
          query.banklogin_agent_id = { $in: agentIds }; // Add filter for sales_agent_id
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

    // Fetch filtered loan files from the database
    const loanFiles = await loanfilemodel.find(query).sort({ banklogin_agent_id: -1 });

    if (loanFiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No loan files found for the selected filters',
      });
    }

    // Get unique sales_agent_ids
    const bankloginAgentIds = [...new Set(loanFiles.map(file => file.banklogin_agent_id))];

    // Fetch users whose userId matches salesAgentIds
    const users = await user.find({ userId: { $in: bankloginAgentIds } }, 'userId name reportingTo');

    // Create a mapping of sales_agent_id to name and reportingTo user IDs
    const bankloginAgentMap = {};
    users.forEach(user => {
      bankloginAgentMap[user.userId] = {
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
    const response = bankloginAgentIds.map(agentId => {
      const loanFilesForAgent = loanFiles.filter(file => file.banklogin_agent_id === agentId);

    
      
      const bankLoginCompletedCount = loanFilesForAgent.filter(file => file.banklogin_status === 'Completed').length;
      const bankLoginPendingCount = loanFilesForAgent.filter(file => file.banklogin_status === 'Pending').length;
      const bankLoginRejectedCount = loanFilesForAgent.filter(file => file.banklogin_status === 'Rejected').length;

      const approvalPendingCount = loanFilesForAgent.filter(file => file.approval_status === 'Pending').length;
      const approvalCompletedCount = loanFilesForAgent.filter(file => file.approval_status === 'Completed').length;

      const disbursalPendingCount = loanFilesForAgent.filter(file => file.disbursal_status === 'Pending').length;
      const disbursalCompletedCount = loanFilesForAgent.filter(file => file.disbursal_status === 'Completed').length;

      // Prepare the details for this sales agent
      return {
        banklogin_agent_id: agentId,
        banklogin_agent_name: bankloginAgentMap[agentId]?.name || 'Pending',
        teamLeaderName: reportingToNameMap[bankloginAgentMap[agentId]?.reportingTo] || '',
        bankLoginCompleted: bankLoginCompletedCount,
        bankLoginPending: bankLoginPendingCount,
        bankLoginRejected: bankLoginRejectedCount,
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


module.exports = {
  getLoanFilesByDate,
  gettvrFilesByDate,
  getcdrFilesByDate,
  getbankloginFilesByDate,
  gettvrperformanceByFilters,
  getcdrperformanceByFilters,
  getbankloginperformanceByFilters
}