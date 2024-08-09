const mongoose = require("mongoose");

// const ExpatriateSchema = new mongoose.Schema({
//     ExpatriateName: String,
//     CERPACNumber: String,
//     CountryName: String,
//     PassportNumber: String,
//     StateOfDeploymentName: String,
//     TaxClearanceDoc: String,
//     Gender: String
// });

// const UnderstudySchema = new mongoose.Schema({
//     Name: String,
//     PhoneNumber: String,
//     Email: String,
//     NINNumber: Number,
//     Age: Number,
//     Gender: String
// });

// const PositionSchema = new mongoose.Schema({
//     PositionName: String,
//     Expatriate: ExpatriateSchema,
//     UnderstudyList: [UnderstudySchema]
// });

// const QuotaReturnSchema = new mongoose.Schema({
//     QuotaReturnFor: Date,
//     SubmittedOn: String,
//     list: [PositionSchema]
// });

// // Define model for Quota Return
// const QuotaReturnModel = mongoose.model('QuotaReturn', QuotaReturnSchema);

// module.exports = QuotaReturnModel;
const UnderstudySchema = new mongoose.Schema({
  Name: String,
  PhoneNumber: String,
  Email: String,
  NINNumber: String,
  Age: String,
  Gender: String,
});
const ExpatriateSchema = new mongoose.Schema({
  ExpatriateName: String,
  CERPACNumber: String,
  CountryName: String,
  PassportNumber: String,
  StateOfDeploymentName: String,
  TaxClearanceDoc: String,
  Gender: String,
});

const PositionSchema = new mongoose.Schema({
  PositionName: String,
  Expatriate: [ExpatriateSchema], // Define as an array of embedded documents
  UnderstudyList: [UnderstudySchema], // Assuming UnderstudySchema is defined similarly
});

const QuotaReturnSchema = new mongoose.Schema({
  QuotaReturnFor: String,
  SubmittedOn: String,
  RCNumber: String,
  list: [PositionSchema], // Define as an array of embedded documents
});

const QuotaReturnDataSchema = new mongoose.Schema({
  quotaReturnsData: [QuotaReturnSchema], // Define as an array of embedded documents
});

const QuotaReturnData = mongoose.model("QuotaReturnData", QuotaReturnSchema);
module.exports = QuotaReturnData;
