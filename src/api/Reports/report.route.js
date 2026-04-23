const express = require("express");
const router = express.Router();

const {
    typeofloanreport,
    pendingcount,
    getTeamLeadersAndReporters,
    tvrreport,
    cdrreport,
    loginreport,
    dispositionReport
} = require("./Reports.controller");

router.get("/gettypeofloanreport",typeofloanreport );
router.get("/pendingcount",pendingcount );
router.get("/getTeamLeadersAndReporters",getTeamLeadersAndReporters );
router.get("/tvrreport",tvrreport );
router.get("/cdrreport",cdrreport );
router.get("/loginreport",loginreport );
router.get("/dispositionreport",dispositionReport );

module.exports = router;