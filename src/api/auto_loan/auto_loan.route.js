const express = require("express");
const router = express.Router();
const {
  createAutoLoanApplication,
  uploadData,
  getfiledata

} = require("./auto_loan.controller");

router.post("/createAutoLoanApplication", createAutoLoanApplication);
router.post("/uploadData", uploadData);
router.get("/getfiledata", getfiledata);


module.exports = router;
