const express = require("express");

const router = express.Router();

const {
  createCallBack,
  getCallBackList,
  updateCallBackStatus,
  getCallBackListByFileNumber,
} = require("./schduledcallback.controller");


// Create Callback
router.post("/schedulecallback", createCallBack);


// Get Callback List
router.get("/getcallbacklist", getCallBackList);

// Get Callback List By File Number
router.get("/getcallbacklistbyfilenumber", getCallBackListByFileNumber);

router.put("/updatecallbackstatus/:id", updateCallBackStatus);

module.exports = router;