const express = require("express");
const router = express.Router();

const auto_loanRoute = require("../auto_loan/auto_loan.route");


router.use("/api/v1", auto_loanRoute);

module.exports = router;
