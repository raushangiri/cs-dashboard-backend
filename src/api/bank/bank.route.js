const express = require("express");
const router = express.Router();
const {
    get_rmDetails,

} = require("./bank_details.controller");

router.get("/getrmDetails", get_rmDetails);


module.exports = router;
