const express = require("express");
const router = express.Router();
const {

  createuser1,
  login,
  changePassword,
  resetPassword,
  getalluser,
  deleteUser,
  findteamleader,
  updateUser,
  getUserById,
  getUserbyteamleader
} = require("../user/user.controller");
const auth = require("../../middlewares/auth");

router.post("/register", createuser1);
router.post("/login", login);
router.post("/changePassword", changePassword);
router.put('/resetPassword/:userId', resetPassword);
router.get("/getalluser",getalluser);
router.delete("/deleteUser",deleteUser);
router.get("/findteamleader",findteamleader);
router.put("/updateUser",updateUser);
router.get("/getUserById/:userId",getUserById);
router.get("/getUserbyteamleader/:userId",getUserbyteamleader);












module.exports = router;
