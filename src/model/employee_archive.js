const mongoose = require("mongoose");
const archiveSchema = new mongoose.Schema({}, { strict: false });
// const countrymodel= {

// }
const archive_employee = mongoose.model("archive_Employee", archiveSchema);
module.exports = archive_employee;
