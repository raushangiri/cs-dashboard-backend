const { required, date } = require('joi');
const mongoose = require('mongoose');

const loanfilesSchema = new mongoose.Schema({
    file_number: {
        type: String,
        required:true
    },
    customer_name: {
        type: String,
        default:""
    },
    customer_mobile_number: {
        type: String,
        default:""
    },
    sales_status: {
        type: String,
        default:""
    },
    sales_agent_id: {
        type: String,
        default:""
    },
    sales_agent_name: {
        type: String,
        default:""
    },
    sales_assign_date:{
        type: Date,
        default:""
    },
    tvr_status: {
        type: String,
        default:""
    },
    tvr_agent_name: {
        type: String,
        default:""
    },
    tvr_agent_id: {
        type: String,
        default:""
    },
    tvr_assign_date:{
        type: Date,
        default:""
    },
    cdr_status: {
        type: String,
        default:""
    },
    cdr_agent_name: {
        type: String,
        default:""
    },
    cdr_agent_id: {
        type: String,
        default:""
    },
    cdr_assign_date:{
        type: Date,
        default:""
    },
    banklogin_status: {
        type: String,
        default:""
    },
    banklogin_agent_name: {
        type: String,
        default:""
    },
    banklogin_agent_id: {
        type: String,
        default:""
    },
    banklogin_assign_date:{
        type: Date,
        default:""
    },
    approval_status: {
        type: String,
        default:""
    },
    approval_assign_date:{
        type: Date,
        default:""
    },
    disbursal_status: {
        type: String,
        default:""
    },
    disbursal_assign_date:{
        type: Date,
        default:""
    },
    file_status: {
        type: String,
        default:""
    },
  createdAt: { type: Date, default: Date.now }

})
const filestatus = mongoose.model('file_status', loanfilesSchema);

module.exports = filestatus;
