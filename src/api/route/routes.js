const express = require("express");
const router = express.Router();

const auto_loanRoute = require("../auto_loan/auto_loan.route");
const userRoute = require("../user/user.route");
const bankroute = require("../bank/bank.route");
const reportroute = require("../Reports/report.route");
// const upload = require('../../middlewares/upload');
const uploadFile = require('../upload/upload.route');

router.use("/api/v1", auto_loanRoute);
router.use("/api/v1", userRoute);
router.use("/api/v1", bankroute);
router.use("/api/v1", reportroute);
router.use("/api/v1", uploadFile);

module.exports = router;
