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
    createGroupChat,
//     readMessages,
// createMessage
getActiveUsers,
createConversation,
getMessages
} = require("./admin.controller");
const Conversation = require("../../model/conversation.model");


router.get("/gettvrFilesByDate",gettvrFilesByDate );
router.get("/getsalesfilehistory",getLoanFilesByDate );
router.get("/getcdrFilesByDate",getcdrFilesByDate );
router.get("/getbankloginFilesByDate",getbankloginFilesByDate );
router.get("/gettvrperformanceByFilters",gettvrperformanceByFilters );
router.get("/getcdrperformanceByFilters",getcdrperformanceByFilters );
router.get("/getbankloginperformanceByFilters",getbankloginperformanceByFilters );
// router.post('/users', createMessage);
// router.get('/getusers', readMessages);
router.get("/getActiveUsers", getActiveUsers);
router.post("/conversations", createConversation);
// router.post("/conversations/group", createGroupChat);

// router.get("/messages/:conversationId", getMessages);

router.get("/conversations/:conversationId/messages", getMessages);

router.get("/conversations/group", async (req, res) => {
  const group = await Conversation.findOne({ type: "group" });
  res.json(group);
});

module.exports = router;