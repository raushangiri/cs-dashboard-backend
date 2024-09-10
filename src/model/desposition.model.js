const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DispositionSchema = new Schema({
  file_number: {
    type: String,
    required: true,
  },
  userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    role:{
      type:String,
      required: true,

    },
    department: {
      type: String,
      required: true,
    },
 
  call_status: {
    type: String,
    // enum: ['Connected', 'Not Connected'],
    required: true,
  },
  is_interested: {
    type: String,
    // enum: ['Interested', 'NotInterested'],
  },
  disposition: {
    type: String,
  },
  selected_documents: [{
    document_name: {
      type: String,
    },
    document_url: {
      type: String,
    }
  }],
  expected_document_date: {
    type: Date,
  },
  not_interested_reason: {
    type: String,
  },
  remarks: {
    type: String,
  },
  file_status: {
    type: String,
    required: true,
  },
 
  created_at: {
    type: Date,
    default: Date.now,
  },
});


const dispositionmodel = mongoose.model('Disposition', DispositionSchema);

module.exports = dispositionmodel;