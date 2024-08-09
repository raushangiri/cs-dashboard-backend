const mongoose = require("mongoose");
const archiveCardSchema = new mongoose.Schema({}, { strict: false });
// const countrymodel= {

// }
const archive_card = mongoose.model("archive_card", archiveCardSchema);
module.exports = archive_card;
