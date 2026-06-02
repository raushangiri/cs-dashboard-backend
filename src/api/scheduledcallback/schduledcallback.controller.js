const CallBack = require("../../model/callback.model");
const user = require("../../model/user.model");


// Create Callback Record
const createCallBack = async (req, res) => {

  try {

    const {
      file_number,
      userId,
      role,
      expected_call_back_date,
      expected_call_back_time,
      remark,
      file_status,
      call_back_status
    } = req.body;

    // Required Field Validation
    if (
      !file_number ||
      !userId ||
      !role ||
      !expected_call_back_date ||
      !expected_call_back_time
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    // Find User Details
    const userdetails = await user.findOne({ userId });

    if (!userdetails) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Create Callback Record
    const newCallBack = new CallBack({

      file_number,

      userId,

      username: userdetails.name,

      role,

      expected_call_back_date,

      expected_call_back_time,

      remark,

      file_status,

      call_back_status:
        call_back_status || "Pending"
    });

    await newCallBack.save();

    return res.status(201).json({
      success: true,
      message: "Call back created successfully",
      data: newCallBack,
    });

  } catch (error) {

    console.log(
      "Create callback error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get Callback List By userid
const getCallBackList = async (req, res) => {

    try {

        const {
            userId,
            file_number,
            fromDate,
            toDate,
            call_back_status
        } = req.query;

        // Dynamic Filter
        let filter = {};

        // Filter By User
        if (userId) {
            filter.userId = userId;
        }

        // Filter By File Number
        if (file_number) {
            filter.file_number = file_number;
        }

        // Filter By Status
        if (call_back_status) {
            filter.call_back_status = call_back_status;
        }

        // Date Range Filter
        if (fromDate && toDate) {

            filter.expected_call_back_date = {

                $gte: new Date(fromDate),

                $lte: new Date(toDate)
            };
        }

        // Fetch Data
        let callbackList = await CallBack.find(filter)

            // Exclude Fields
            .select(
                '-createdAt -updatedAt -__v -_id'
            )

            .sort({
                expected_call_back_date: 1
            })

            .lean();

        // Format Date
        callbackList = callbackList.map((item) => ({

            ...item,

            expected_call_back_date:
                item.expected_call_back_date
                    ? item.expected_call_back_date
                        .toISOString()
                        .split('T')[0]
                    : null
        }));

        return res.status(200).json({

            success: true,

            count: callbackList.length,

            data: callbackList
        });

    } catch (error) {

        console.log(
            "Get Callback List Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Internal server error",

            error: error.message
        });
    }
};


// Get Callback List By file number

const getCallBackListByFileNumber = async (req, res) => {
    try {
        const {
            file_number
        } = req.query;
        // Validate File Number
        if (!file_number) {
            return res.status(400).json({
                success: false,
                message: 'file_number is required'
            });
        }
        // Fetch Callback List
        let callbackList = await CallBack.find({
            file_number
        })
            // Exclude Fields
            .select(
                '-createdAt -updatedAt -__v'
            )

            .sort({

                expected_call_back_date: 1
            })

            .lean();

        // Format Date
        callbackList = callbackList.map((item) => ({

            ...item,

            expected_call_back_date:
                item.expected_call_back_date
                    ? item.expected_call_back_date
                        .toISOString()
                        .split('T')[0]
                    : null
        }));

        return res.status(200).json({

            success: true,

            count: callbackList.length,

            data: callbackList
        });

    } catch (error) {

        console.log(
            'Get Callback List Error:',
            error
        );

        return res.status(500).json({

            success: false,

            message: 'Internal server error',

            error: error.message
        });
    }
};

const updateCallBackStatus = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            call_back_status,
            expected_call_back_date,
            expected_call_back_time
        } = req.body;

        let updateData = {

            call_back_status
        };

        // If Rescheduled
        if (
            call_back_status === 'rescheduled'
        ) {

            updateData.expected_call_back_date =
                expected_call_back_date;

            updateData.expected_call_back_time =
                expected_call_back_time;
        }

        const updatedCallback =
            await CallBack.findByIdAndUpdate(

                id,

                updateData,

                {
                    new: true
                }
            );

        return res.status(200).json({

            success: true,

            message:
                'Callback updated successfully',

            data: updatedCallback
        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: 'Internal server error'
        });
    }
};

module.exports = {
  createCallBack,
  getCallBackList,
  updateCallBackStatus,
  getCallBackListByFileNumber
};