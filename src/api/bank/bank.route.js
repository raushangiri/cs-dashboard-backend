const express = require("express");
const router = express.Router();
const {
    get_rmDetails,
    getDocumentList

} = require("./bank_details.controller");

router.get("/getrmDetails", get_rmDetails);
router.post("/getdocuments", getDocumentList);


module.exports = router;
