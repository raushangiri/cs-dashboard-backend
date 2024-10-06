const express = require("express");
const router = express.Router();

const {
    gettvrFilesByDate,
    getLoanFilesByDate,
    getcdrFilesByDate,
    getbankloginFilesByDate,
    gettvrperformanceByFilters,
    getcdrperformanceByFilters,
    getbankloginperformanceByFilters
} = require("./admin.controller");


router.get("/gettvrFilesByDate",gettvrFilesByDate );
router.get("/getsalesfilehistory",getLoanFilesByDate );
router.get("/getcdrFilesByDate",getcdrFilesByDate );
router.get("/getbankloginFilesByDate",getbankloginFilesByDate );
router.get("/gettvrperformanceByFilters",gettvrperformanceByFilters );
router.get("/getcdrperformanceByFilters",getcdrperformanceByFilters );
router.get("/getbankloginperformanceByFilters",getbankloginperformanceByFilters );



module.exports = router;