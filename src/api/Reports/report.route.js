const express = require("express");
const router = express.Router();

const {
    typeofloanreport,
    pendingcount
} = require("./Reports.controller");

router.get("/gettypeofloanreport",typeofloanreport );
router.get("/pendingcount",pendingcount );


module.exports = router;