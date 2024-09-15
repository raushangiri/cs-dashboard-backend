const express = require("express");
const router = express.Router();

const {
    typeofloanreport
} = require("./Reports.controller");

router.get("/gettypeofloanreport",typeofloanreport );


module.exports = router;