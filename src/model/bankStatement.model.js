const mongoose = require('mongoose');

const monthSchema = new mongoose.Schema({
  month: { type: String, required: true },
  year: { type: Number, required: true },
  dayValues: { type: [String], required: true }, // Array of strings for day 5, 10, 15, etc.
  totalAB: { type: String }, // Add these if you intend to store Total AB for each month
  totalABB: { type: String } // Add these if you intend to store Total ABB for each month
});

const bankStatementSchema = new mongoose.Schema({
    file_number:{ type: String, required: true },
  bankAccountNumber: { type: String, required: true },
  totalABB: { type: String , required: true},
  totalAB: { type: String, required: true },
  sixMonthABB: { type: String, required: true },
  oneYearABB: { type: String, required: true },
  months: [monthSchema] // Embedding the month schema for the 12 months
},
{
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
});

module.exports = mongoose.model('BankStatement', bankStatementSchema);
