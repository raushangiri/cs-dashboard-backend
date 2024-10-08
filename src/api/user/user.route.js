const express = require("express");
const router = express.Router();
const {

  createuser1,
  login,
  changePassword,
  resetPassword,
  getalluser,
  deleteUser
} = require("../user/user.controller");
const auth = require("../../middlewares/auth");

router.post("/register", createuser1);
router.post("/login", login);
router.post("/changePassword", changePassword);
router.post("/resetPassword", resetPassword);
router.get("/getalluser",getalluser);
router.delete("/deleteUser",deleteUser);





module.exports = router;
