const mongoose = require('mongoose');

// Define the schema for loan details
const loanSchema = new mongoose.Schema({
  bank_name: {
    type: String,
    
  },
  emi_amount: {
    type: String,
    
  },
  loan_term: {
    type: String,
    
  },
  loan_start_date: {
    type: String, // You could use Date type here if you want to store as date
    
  },
  loan_end_date: {
    type: String, // You could use Date type here if you want to store as date
    
  },
  emi_date: {
    type: String, // You could use Date type here if you want to store as date
   
  },
  no_of_emi_bounces: {
    type: String,
    
  },
  bounces_reason: {
    type: String,
   
  },
  car_details: {
    type: String,
   
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
