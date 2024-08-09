const joi = require("joi");
const errorFunction = require("../../services/errorFunction");


const fileid = joi.object({
    userid: joi.string().required(),
    // password:joi.string().required()
})

module.exports = { fileid }