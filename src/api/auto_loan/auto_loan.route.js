const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const XLSX = require('xlsx');

const upload = multer({ dest: 'uploads/' }); // Store uploaded files in 'uploads/' folder


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
  getProcessToBankloginFiles,
  getLoanfiledetailsbyfilenumber,
  getDispositionById,
  checkFileReassignStatus,
  teamleaderdashboardcount,
  createbankStatement,
  getbankStatement,
  getLoanFilesByFilters,
  getTvrDocumentsCountByUserId,
  getCdrDocumentsCountByUserId,
  getteamleaderperformance,
  getteamleaderLoanFilesByFilters,
  deletedocumentdata,
  viewbankStatement,
  updateBankStatement
} = require("./auto_loan.controller");


router.get("/getLoanfiledetailsbyfilenumber/:file_number", getLoanfiledetailsbyfilenumber);
router.post("/createAutoLoanApplication", createAutoLoanApplication);
router.post("/uploadData", upload.single('file'), uploadData);
router.delete('/deleteDocument/:id', deletedocumentdata);
router.get("/getfiledata/:mobile_number", getfiledata);
router.post("/createLoanFileOverview", createLoanFileOverview);
router.post("/createpersonaldetails/:file_number", createpersonadetails);
router.get("/getpersonadetails/:file_number", getpersonadetails);
router.post("/createreferencedetail/:file_number", createreferencedetail);
router.get("/getreferencedetail/:file_number", getreferencedetail);
router.post("/createdesposition", createdesposition);
router.get("/getdesposition/:file_number", getdesposition);
router.get("/checkFileReassignStatus/:file_number", checkFileReassignStatus);
router.get("/getDispositionById/:_id", getDispositionById);
router.post("/createLoandetails/:file_number", createLoandetails);
router.get("/getLoandetails/:file_number", getLoandetails);
router.get("/getdashboardcount/:userId", getDocumentsCountByUserId);
router.get("/getTvrDocumentsCountByUserId/:userId", getTvrDocumentsCountByUserId);
router.get("/getCdrDocumentsCountByUserId/:userId", getCdrDocumentsCountByUserId);
router.get("/teamleaderdashboardcount/:userId", teamleaderdashboardcount);
router.get("/getLoanFilesByUserId/:userId", getLoanFilesByUserId);
router.get("/admindashboardcount", admindashboardcount);
router.get("/getAllLoanFiles", getAllLoanFiles);
router.get("/getProcessToTVRFiles", getProcessToTVRFiles);
router.get("/getProcessToCDRFiles", getProcessToCDRFiles);
router.get("/getProcessToBankloginFiles", getProcessToBankloginFiles);
router.post("/updatedocumentdata", updatedocumentdata);
router.get("/getdocumentdata/:file_number", getdocumentdata);
router.get("/getSalesTeamLoanFiles/:userId", getSalesTeamLoanFiles);
router.post("/createbankStatement", createbankStatement);
router.get("/getbankStatement/:file_number", getbankStatement);
router.get("/viewbankStatement/:id", viewbankStatement);
router.get("/getLoanFilesByFilters", getLoanFilesByFilters);
router.get("/getteamleaderLoanFilesByFilters", getteamleaderLoanFilesByFilters);
router.get("/getteamleaderperformance/:userId", getteamleaderperformance);
router.put('/updateBankStatement/:_id', updateBankStatement);



module.exports = router;
