const mongoose = require('mongoose');
const countrySchema = new mongoose.Schema({},{ strict: false })
// const countrymodel= {
// }
const country = mongoose.model('country', countrySchema)
module.exports = country

