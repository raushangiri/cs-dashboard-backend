const express = require("express");
const router = express.Router();
const {
  createAutoLoanApplication,
  uploadData,
  getfiledata,
  createLoanFileOverview,
  createpersonadetails,
  getpersonadetails,
  createreferencedetail,
  getreferencedetail,
  createdesposition,
  getdesposition,
  createLoandetails,
  getLoandetails,
  getDocumentsCountByUserId,
  getLoanFilesByUserId,
  admindashboardcount,
  getAllLoanFiles,
  getProcessToTVRFiles,
  getProcessToCDRFiles,
  updatedocumentdata,
  getdocumentdata,
  getSalesTeamLoanFiles,
  getProcessToBankloginFiles

} = require("./auto_loan.controller");

router.post("/createAutoLoanApplication", createAutoLoanApplication);
router.post("/uploadData", uploadData);
router.get("/getfiledata/:mobile_number", getfiledata);
router.post("/createLoanFileOverview", createLoanFileOverview);
router.post("/createpersonaldetails/:file_number", createpersonadetails);
router.get("/getpersonadetails/:file_number", getpersonadetails);
router.post("/createreferencedetail/:file_number", createreferencedetail);
router.get("/getreferencedetail/:file_number", getreferencedetail);
router.post("/createdesposition", createdesposition);
router.get("/getdesposition/:file_number", getdesposition);
router.post("/createLoandetails/:file_number", createLoandetails);
router.get("/getLoandetails/:file_number", getLoandetails);
router.get("/getdashboardcount/:userId", getDocumentsCountByUserId);
router.get("/getLoanFilesByUserId/:userId", getLoanFilesByUserId);
router.get("/admindashboardcount", admindashboardcount);
router.get("/getAllLoanFiles", getAllLoanFiles);
router.get("/getProcessToTVRFiles", getProcessToTVRFiles);
router.get("/getProcessToCDRFiles", getProcessToCDRFiles);
router.get("/getProcessToBankloginFiles", getProcessToBankloginFiles);

router.post("/updatedocumentdata", updatedocumentdata);
router.get("/getdocumentdata/:file_number", getdocumentdata);
router.get("/getSalesTeamLoanFiles/:userId", getSalesTeamLoanFiles);



module.exports = router;
