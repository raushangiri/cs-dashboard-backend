const express = require("express");
const router = express.Router();
const {
  createuser,
  login,
  emailvalidate,
  forgetpassword,
  resetpassword,
  resetauthpassword,
  getuser,
  checkemail,
  createUserCompany,
  emailverified,
  verifiedrcnumber,
  resendemail,
  sendmail,
  contactus,
  emailexpiry,
  enquiryeelms,
  validateManagementEmail,
  changeRepresentative,
  fetchCompanydataFromMoi,
} = require("../user/user.controller");
const auth = require("../../middlewares/auth");

router.post("/register", createuser);

router.post("/v2/register", createUserCompany);

router.post("/emailverified", emailverified);

router.get("/verifiedrcnumber/:rcnumber", verifiedrcnumber);

router.post("/resendemail", resendemail);

router.post("/login", login);

router.post("/emailvalidate", emailvalidate);

router.post("/checkemail", checkemail);

router.post("/forgetpassword", forgetpassword);

router.post("/resetpassword", resetpassword);

router.post("/resetauthpasswsord", resetauthpassword);

router.post("/getuser", auth, getuser);

router.post("/sendmail", sendmail);

router.post("/contactus", contactus);

router.get("/emailexpiry", emailexpiry);

router.post("/enquiry", enquiryeelms);

router.post("/validate/email", validateManagementEmail);

router.post("/user/change-representative", changeRepresentative);

router.get("/fetchCompanydataFromMoi", fetchCompanydataFromMoi);

module.exports = router;
