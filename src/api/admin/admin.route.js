const express = require("express");
const router = express.Router();
const user = require('../../model/user.model'); // Assuming your model is in the same folder
const Chat = require('../../model/chat.model'); // Assuming your model is in the same folder
const {
    gettvrFilesByDate,
    getLoanFilesByDate,
    getcdrFilesByDate,
    getbankloginFilesByDate,
    gettvrperformanceByFilters,
    getcdrperformanceByFilters,
    getbankloginperformanceByFilters,
    getusers,
    createChat,
    createGroupChat
//     readMessages,
// createMessage
} = require("./admin.controller");


router.get("/gettvrFilesByDate",gettvrFilesByDate );
router.get("/getsalesfilehistory",getLoanFilesByDate );
router.get("/getcdrFilesByDate",getcdrFilesByDate );
router.get("/getbankloginFilesByDate",getbankloginFilesByDate );
router.get("/gettvrperformanceByFilters",gettvrperformanceByFilters );
router.get("/getcdrperformanceByFilters",getcdrperformanceByFilters );
router.get("/getbankloginperformanceByFilters",getbankloginperformanceByFilters );
// router.post('/users', createMessage);
// router.get('/getusers', readMessages);
router.get("/getusers", getusers);
router.post("/createChat", createChat);
router.post("/createGroupChat", createGroupChat);

module.exports = router;