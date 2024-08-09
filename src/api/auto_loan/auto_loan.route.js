const express = require("express");
const router = express.Router();
const {
  createAutoLoanApplication,

} = require("./auto_loan.controller");

router.post("/createAutoLoanApplication", createAutoLoanApplication);


module.exports = router;
