const { string } = require("joi");
const mongoose = require("mongoose");
const quotaSchema = new mongoose.Schema(
  {
    rcnumber: {
      type: String,
      required: true,
    },
    approvalNumber: {
      type: String,
      required: true,
      unique: true,
    },
    expatriateType: {
      type: String,
      required: true,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    totalSlotApproved: {
      type: String,
      required: true,
    },
    approvedDate: {
      type: String,
      required: true,
    },
    approvalLetterDate: {
      type: String,
      // required: true,
    },
    expatriate_doc: {
      type: String,
      // required: true,
    },
    additional_name: {
      type: String,
      // required: true,
    },
    additional_doc: {
      type: String,
      // required: true,
    },
    position: [
      {
        Position: {
          type: String,
          required: true,
        },
        SlotApproved: {
          type: Number,
          required: true,
        },
        utillizedslots: {
          type: Number,
          default: 0,
        },
        quotaId: {
          type: String,
          required: true,
        },
      },
    ],
    availableQuota: {
      type: Number,
      // required: true,
    },
    userid: {
      type: String,
      required: true,
    },
    comanyname: {
      type: String,
      // required: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);
const quota = mongoose.model("quotadata", quotaSchema);
module.exports = quota;
