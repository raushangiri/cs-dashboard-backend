const mongoose = require('mongoose');

// Define the schema for loan details
const loanSchema = new mongoose.Schema({
  bank_name: {
    type: String,
    required: true,
  },
  emi_amount: {
    type: String,
    required: true,
  },
  loan_term: {
    type: String,
    required: true,
  },
  loan_start_date: {
    type: String, // You could use Date type here if you want to store as date
    required: true,
  },
  loan_end_date: {
    type: String, // You could use Date type here if you want to store as date
    required: true,
  },
  emi_date: {
    type: String, // You could use Date type here if you want to store as date
    required: true,
  },
  no_of_emi_bounces: {
    type: String,
    required: true,
  },
  bounces_reason: {
    type: String,
    required: true,
  },
  car_details: {
    type: String,
    required: true,
  },
  file_number: {
    type: String,
    required: true
  },
  createdAt: { type: Date, default: Date.now }
}); // Adding timestamps to keep track of createdAt and updatedAt

// Create the model
const LoandataModel = mongoose.model('customer_pre_loan', loanSchema);

module.exports = LoandataModel;
