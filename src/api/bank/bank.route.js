const express = require("express");
const router = express.Router();
const {
    get_rmDetails,
    getDocumentList,
    getBankNames,
    getlist

} = require("./bank_details.controller");

router.get("/getrmDetails", get_rmDetails);
router.post("/getdocuments", getDocumentList);
router.post("/getBankNames", getBankNames);
router.get("/getlist", getlist);


module.exports = router;
