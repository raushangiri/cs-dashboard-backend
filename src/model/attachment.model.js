const mongoose = require("mongoose");
const attachment_schema = new mongoose.Schema(
  {
file_number:{
    type:String
},
document_type:{
    type:String
},
document_name:{
    type:String
},
downloadUrl:{
    type:String
},
readUrl:{
    type:String
},
createdAt: { type: Date, default: Date.now }


  });
  const attachment = mongoose.model("loan_documents", attachment_schema);
  module.exports = attachment;