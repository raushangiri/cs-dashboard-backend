const mongoose = require("mongoose");

const callBackSchema = new mongoose.Schema(
  {
    file_number: {
      type: String,
      required: true,
      trim: true,
    },
    file_status: {
      type: String,
      default: "",
    },
    userId: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    call_back_status: {
      type: String,
    //   enum: ["pending", "Completed", "Missed","cancelled","Rescheduled","busy"],
      default: "pending",
    },

    expected_call_back_date: {
      type: Date,
      required: true,
    },

    expected_call_back_time: {
      type: String,
      required: true,
    },

    remark: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // auto createdAt & updatedAt
  }
);

module.exports = mongoose.model("scheduledCallBack", callBackSchema);