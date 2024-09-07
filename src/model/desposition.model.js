const mongoose = require('mongoose');

const dispositionSchema = new mongoose.Schema({
  call_status: { type: String, required: true },
  disposition: { type: String, required: true },
  user_id: { type: String},
  user_name: { type: String},
  expected_to_send_document_by: { type: String },
  document_list: [
    {
      document_name: String,
      document_url: String,
      uploaded_at: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  remark: String,
  file_number: { type: String, required: true }
});

const dispositionModel = mongoose.model('Disposition', dispositionSchema);

module.exports = dispositionModel;