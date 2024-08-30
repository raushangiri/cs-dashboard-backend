const express = require("express");
const router = express.Router();

const auto_loanRoute = require("../auto_loan/auto_loan.route");
const userRoute = require("../user/user.route");
const bankroute = require("../bank/bank.route");


router.use("/api/v1", auto_loanRoute);
router.use("/api/v1", userRoute);
router.use("/api/v1", bankroute);


module.exports = router;
