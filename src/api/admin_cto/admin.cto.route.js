const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const {
  ctogetalldata,
  // ctogetdatabyid,
  updatedetailsrequest,
  exemptgetalldata,
  updateexemptrequest,
} = require("./admin.cto.controller");

router.get(
  "/cto/requests/change-representative/all",
  //  auth,
  ctogetalldata
);

// router.get(
//   "/cto/requests/change-representative/update/:request_id",
//   ctogetdatabyid
// );

router.put(
  "/cto/requests/change-representative/details/update/:request_id",
  auth,
  updatedetailsrequest
);

router.get(
  "/cto/requests/exempt/all",
  //  auth,
  exemptgetalldata
);

// router.get(
//   "/cto/requests/change-representative/update/:request_id",
//   ctogetdatabyid
// );

router.put(
  "/cto/requests/exempt/details/update",
  // auth,
  updateexemptrequest
);

module.exports = router;
