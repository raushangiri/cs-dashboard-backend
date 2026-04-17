// models/LoanApproval.js
const mongoose = require("mongoose");

const loanApprovalSchema = new mongoose.Schema(
  {
    file_number: {
      type: String,
      required: true,
      unique: true,
    },

    loanType: {
      type: String,
      enum: ["Auto_loan", "Personal_loan", "Business Loan", "Home_Loan", "LAP"],
      required: true,
    },
    bankName: String,
    customerName: String,
    emiDate: String,
    asset: String,
    basicLoanAmount: Number,
    loanSuraksha: Number,
    pfCharges: Number,
    docCharges: Number,
    stampDuty: Number,
    emiAmount: Number,
    tenure: Number,
    deductFc: Number,
    rto: Number,
    netDisbursalAmount: Number,
    customerPaymentDD: Number,
    holdPayment: Number,
    docOnline: Number,
    carInsurance: Number,
    minusFcAmount: Number,
    preEmi: Number,
    roiType: {
      type: String,
      enum: ["Reducing", "Flat"],
    },
    subjectivity: String,
    inhandAmountCustomer: Number,
    remark: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("LoanApproval", loanApprovalSchema);