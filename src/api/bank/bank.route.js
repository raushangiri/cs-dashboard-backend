const express = require("express");
const router = express.Router();
const {
    get_rmDetails,
    getDocumentList,
    getBankNames,
    getlist,
    createBankDetail,
    getbanklogindetails,
    sendDocumentEmail,
    deleteBankDetail,
    createbankmaster
} = require("./bank_details.controller");

router.post("/getrmDetails", get_rmDetails);
router.post("/getdocuments", getDocumentList);
router.post("/getBankNames", getBankNames);
router.get("/getlist", getlist);
router.post("/createBankDetail", createBankDetail);
router.get("/getbanklogindetails/:file_number", getbanklogindetails);
router.post("/sendEmailWithAttachment", sendDocumentEmail);
// router.get("/getbanklogindetailsbyid ", getbanklogindetailsbyid);
router.delete("/deleteBankDetail/:_id", deleteBankDetail);
router.post("/createbankmaster", createbankmaster);

module.exports = router;
