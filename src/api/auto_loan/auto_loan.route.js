const express = require("express");
const router = express.Router();
const {
  createAutoLoanApplication,
  uploadData,
  getfiledata,
  createLoanFileOverview,
  createpersonadetails,
  getpersonadetails

} = require("./auto_loan.controller");

router.post("/createAutoLoanApplication", createAutoLoanApplication);
router.post("/uploadData", uploadData);
router.get("/getfiledata/:mobile_number", getfiledata);
router.post("/createLoanFileOverview", createLoanFileOverview);
router.post("/createpersonadetails/:file_number", createpersonadetails);
router.get("/getpersonadetails/:file_number", getpersonadetails);


module.exports = router;
