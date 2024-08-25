const express = require("express");
const router = express.Router();

const auto_loanRoute = require("../auto_loan/auto_loan.route");
const userRoute = require("../user/user.route");


router.use("/api/v1", auto_loanRoute);
router.use("/api/v1", userRoute);

module.exports = router;
