const express = require("express");
const router = express.Router();
const {
  fileuploadcomapny,
  uploadfilearray,
  fileuploademployee,
  fileuploaddependant,
  getcompanydoc,
  getemployeedoc,
  getemployeephoto,
  getarraydocs,
  getdependentphoto,
} = require("./upload.controller");
const { upload } = require("./upload.service");
const fs = require("fs");
require("dotenv").config();
const useridValidation = require("../../middlewares/validation");
const auth = require("../../middlewares/auth");

router.post(
  "/uploadcompany",
  auth,
  useridValidation,
  upload.single("company"),
  fileuploadcomapny
);

router.post(
  "/uploadmultiple",
  useridValidation,
  upload.array("docs"),
  uploadfilearray
);

router.post(
  "/uploademployee",
  auth,
  useridValidation,
  upload.single("employee"),
  fileuploademployee
);

router.post(
  "/uploaddependant",
  auth,
  useridValidation,
  upload.single("dependant"),
  fileuploaddependant
);

router.post("/getcompanydoc", auth, getcompanydoc);

router.post("/getemployeedoc", auth, getemployeedoc);

router.post("/getprofilepic", auth, getemployeephoto);

router.post("/getdependentphoto", auth, getdependentphoto);

router.post("/getarraydocs", auth, getarraydocs);

module.exports = router;
