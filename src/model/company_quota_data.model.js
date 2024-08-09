const mongoose = require("mongoose");
const usercompanySchema = new mongoose.Schema({}, { strict: false });

const PositionSchema = new mongoose.Schema({
  Position: {
    type: String,
  },
  SlotApplied: {
    type: Number,
  },
  SlotApproved: {
    type: Number,
  },
  SlotRejected: {
    type: Number,
  },
});

const companyQuotaDataSchema = new mongoose.Schema(
  {
    RCNumber: {
      type: String,
    },
    ApprovalNumber: {
      type: String,
    },
    CompanyId: {
      type: Number,
    },
    ExpatriateQuotaDetailId: {
      type: Number,
    },
    ExpatriateType: {
      type: String,
    },
    ExpirationDate: {
      type: Date,
    },
    TotalSlotApplied: {
      type: Number,
    },
    TotalSlotApproved: {
      type: Number,
    },
    TotalSlotRejected: {
      type: Number,
    },
    Status: {
      type: String,
    },
    ApprovedDate: {
      type: Date,
    },
    ReasonForRequest: {
      type: String,
    },
    ApplicationDate: {
      type: Date,
    },
    NCDMBApplicationId: {
      type: Number,
      default: null,
    },
    NCDMBCompanyId: {
      type: Number,
      default: null,
    },
    ApprovalLetterDate: {
      type: Date,
      default: null,
    },
    PositionList: {
      type: [PositionSchema],
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);
const companyquotadata = mongoose.model(
  "companyquotadata",
  companyQuotaDataSchema
);
module.exports = companyquotadata;
