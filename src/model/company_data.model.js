const mongoose = require("mongoose");
// const usercompanySchema = new mongoose.Schema({}, { strict: false });
const companyDataSchema = new mongoose.Schema(
  {
    CompanyId: { type: Number },
    CompanyName: { type: String },
    SectorNameOfCompany: { type: String },
    NatureOfBusiness: { type: String },
    Email: { type: String },
    PhoneNumber: { type: String },
    RCNumber: { type: String },
    TotalCapital: { type: Number }, // Assuming it's a numeric value
    ShareCapital: { type: Number }, // Assuming it's a numeric value
    NigerianPercentageOfShare: { type: Number },
    ForeignPercentageOfShare: { type: Number },
    SummaryOfManagerialFunction: { type: Number },
    SummaryOfClericalDuties: { type: Number },
    SummaryOfSkilledLabor: { type: Number },
    SummaryOfUnSkilledLabor: { type: Number },
    TotalSummary: { type: Number },
    NameOfRepresentative: { type: String },
    TINNumber: { type: String },
    TCCNumber: { type: String },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);
const companyData = mongoose.model("companyData", companyDataSchema);
module.exports = companyData;
