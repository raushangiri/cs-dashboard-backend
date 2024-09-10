const { required } = require('joi');
const mongoose = require('mongoose');

const loanfilesSchema = new mongoose.Schema({
    file_number: {
        type: String,
        required:true
    },
    customer_name: {
        type: String,
        default:" "
    },
    customer_mobile_number: {
        type: String,
        default:" "
    },
    sales_status: {
        type: String,
        default:" "
    },
    sales_agent_id: {
        type: String,
        default:" "
    },
    tvr_status: {
        type: String,
        default:" "
    },
    tvr_agent_id: {
        type: String,
        default:" "
    },
    cdr_status: {
        type: String,
        default:" "
    },
    cdr_agent_id: {
        type: String,
        default:" "
    },
    bank_login_status: {
        type: String,
        default:" "
    },
    banklogin_agent_id: {
        type: String,
        default:" "
    },
    approval_status: {
        type: String,
        default:" "
    },
    disbursal_status: {
        type: String,
        default:" "
    },
    file_status: {
        type: String,
        default:" "
    },
  createdAt: { type: Date, default: Date.now }

})
const filestatus = mongoose.model('file_status', loanfilesSchema);

module.exports = filestatus;
