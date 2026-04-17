const FileStatus = require("../../model/loan_file.model"); // adjust path if needed

const getInterestedFiles = async (startDate, endDate) => {

  const pipeline = [
    {
      $match: {
        sales_status: "Interested",
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $lookup: {
        from: "loan_file_overviews",
        localField: "file_number",
        foreignField: "file_number",
        as: "loan_details"
      }
    },
    {
      $unwind: "$loan_details"
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ["$loan_details", "$$ROOT"]
        }
      }
    },
    {
      $project: {
        loan_details: 0
      }
    }
  ];

  return await FileStatus.aggregate(pipeline);
};

module.exports = {
  getInterestedFiles
};