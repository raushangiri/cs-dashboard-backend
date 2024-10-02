const express = require("express");
const router = express.Router();

const {
    typeofloanreport,
    pendingcount,
    getTeamLeadersAndReporters
} = require("./Reports.controller");

router.get("/gettypeofloanreport",typeofloanreport );
router.get("/pendingcount",pendingcount );
router.get("/getTeamLeadersAndReporters",getTeamLeadersAndReporters );


module.exports = router;