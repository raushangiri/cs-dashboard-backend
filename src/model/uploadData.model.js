const mongoose = require('mongoose');

const uploadDataschema = new mongoose.Schema({
  customerName: { type: String},
  customerNumber: { type: String},
  productName: { type: String},
  permanentAddress: { type: String},
  location: { type: String},
  companyName: { type: String},
  salary: { type: String},
  selfEmployee: { type: String},
  companyNumber: { type: String},
  companyAddress: { type: String},
  emailId: { type: String},
  bankName: { type: String},
  tenure: { type: String},
  loanAmount: { type: String},
  carName: { type: String},
  model: { type: String},
  carNumber: { type: String},
  insurance: { type: String}
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

const uploadData = mongoose.model('Loan_file', uploadDataschema);

module.exports = uploadData;