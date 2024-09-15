const mongoose = require('mongoose');

const BankDetailSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    file_number:{
        type:String
    },
    bank_login_status:{
        type: String,
        enum: ['Yes', 'No'],
        default:"No"
    },
    call_status:{
        type: String,
        default:""
    },
    reason_for_notlogin:{
        type: String,
    },
    loan_type: {
        type: String,
        // required: true
    },
    bank_name: {
        type: String,
        // required: true
    },
    rm1_name: {
        type: String,
        default: ''
    },
    rm1_contact_number: {
        type: String,
        default: ''
    },
    
    rm2_name: {
        type: String,
        default: ''
    },
    rm2_contact_number: {
        type: String,
        default: ''
    },
    email_1:{
        type: String,
        default: ''
    },
    email_2:{
        type: String,
        default: ''
          },
    document_status: {
        type: String,
        // enum: ['Shared with RM', 'File is not Ready'],
        // default: 'Not Ready'
    },
    remarks: {
        type: String,
        default: ''
    }
}, {
    createdAt: { type: Date, default: Date.now }
});

const BankDetail = mongoose.model('banklogindetail', BankDetailSchema);

module.exports = BankDetail;
