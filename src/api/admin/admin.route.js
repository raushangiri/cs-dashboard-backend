const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const {
  deleteemployee,
  fetchrequest,
  changepassword,
  documenturl,
  getdeletemeployee,
  getallpassword,
  changestate,
  resetforgotpassword,
  getcompanydocs,
  companyforgotpassword,
  resetpassword,
  getallcompanydocs,
  getallusersdata,
  getuserdetails,
  getallcomapnydata,
  getcomapnydetails,
  updatekycstatus,
  admindashboard,
  getemployeedata,
  getemplayeedetails,
  empkycstatusupdate,
  createhelpdesk,
  helpdeskresetpass,
  helpdesklogin,
  getuserbytoken,
  updateuser,
  reportalldata,
  kycdata,
  companykycbyid,
  employeekycdata,
  forgetpassworddata,
  enquirydata,
  enquirybyid,
  assignkyc,
  deleterequestemployee,
  deleterequestemployeebyid,
  assignemployeekyc,
  assignreports,
  assigncompanydocs,
  serachcompanydetails,
  assignenquiry,
  assigndeleteemployeerequest,
  searchemployeedetails,
  employeekycbyid,
  cardall,
  getcardbyid,
  createadminusers,
  getallmanagementdata,
  adminuserlogin,
  getrepresetstivedata,
  adminresetpassword,
  adminassign,
  getadminuserbytoken,
  getallcardprintingrequest,
  getalldispatchrequest,
  getcardprintingrequestbyid,
  cardprintingassign,
  cardDispatchassign,
  getallemployeeexempt,
  getemployeeexemptbyid,
  assignemployeeexempt,
} = require("./admin.controller");

// router.post("/adminlogin", adminlogin);

router.get("/fetchrequest", auth, fetchrequest);

router.post("/deleteapproved", auth, deleteemployee);

// router.post("/documenturl", auth, documenturl);

router.get("/getdeletemeployee/:_id", auth, getdeletemeployee);

router.post("/changepassword", auth, changepassword);

// router.post("/company/reset_password/:token", resetpassword);

router.put("/resetforgotpassword", resetforgotpassword);

router.put("/admin/setnewpassword", auth, resetpassword);

router.get("/getallpassword", getallpassword);

router.post("/requests/company/forgotpassword/changestate", auth, changestate);

router.post("/doc/url", auth, getcompanydocs);

router.get(
  "/requests/company/forgotpassword/:_id",
  auth,
  companyforgotpassword
);

router.get("/company/:_id", getallcompanydocs);

router.get("/company/all/details", getallcomapnydata);

router.get("/companydetails/:_id", getcomapnydetails);

router.put("/company/upadate/kyc_status", updatekycstatus);

router.get("/employee/all/details", getemployeedata);

router.get("/employeedetails/:_id", getemplayeedetails);

router.put("/employee/upadate/kyc_status", empkycstatusupdate);

router.get("/dashboard-summary", admindashboard);

router.post("/help-desk/user/create", createhelpdesk);

router.post("/help-desk/user/reset_password", helpdeskresetpass);

router.post("/help-desk/user/login", helpdesklogin);

router.get("/help-desk/user/getbytoken", getuserbytoken);

router.get("/help-desk/user/all", getallusersdata);

router.get("/help-desk/user/:_id", getuserdetails);

router.put("/help-desk/user/update", updateuser);

router.get("/help-desk/request/kyc/all", kycdata);

router.get("/help-desk/request/company/kyc/:_id", companykycbyid);

router.get("/help-desk/request/employee/kyc/all", employeekycdata);

router.get("/help-desk/request/employee/kyc/:_id", employeekycbyid);

router.get("/help-desk/request/help-support/all", reportalldata);

router.get("/help-desk/request/password-reset/all", forgetpassworddata);

router.get("/help-desk/request/enquiry/all", enquirydata);

router.get("/help-desk/request/enquiry/:_id", enquirybyid);

router.put("/help-desk/request/users/kysstatus/set", assignkyc);

router.get("/help-desk/requests/employee-delete/all", deleterequestemployee);

router.get(
  "/help-desk/requests/employee-delete/:request_id",
  deleterequestemployeebyid
);

router.put(
  "/help-desk/request/users/employee/kysstatus/set",
  assignemployeekyc
);

router.put("/help-desk/request/users/reportstatus/set", assignreports);

router.put("/help-desk/request/users/comanydocstatus/set", assigncompanydocs);

router.put("/help-desk/request/users/enquiry/set", assignenquiry);

router.put(
  "/help-desk/requests/employee-delete/assign-user",
  assigndeleteemployeerequest
);

router.get("/help-desk/company_details", serachcompanydetails);

router.get("/help-desk/employee_details", searchemployeedetails);

router.get("/card-printing/request/all", cardall);

router.get("/card-printing/request/:_id", getcardbyid);

router.post("/adminusers/create", createadminusers);

router.post("/adminuser/resetpassword", adminresetpassword);

router.post("/adminuser/login", adminuserlogin);

router.get("/admin/requests/change-representative/all", getallmanagementdata);

router.get("/requests/change-representative/:request_id", getrepresetstivedata);

router.put("/adminuser/helpdesk/assign", adminassign);

router.get("/adminuser/getuserbytoken", getadminuserbytoken);

router.get(
  "/help-desk/requests/card-printing/pending/all",
  getallcardprintingrequest
);

router.get(
  "/help-desk/requests/card-printing/printed/all",
  getalldispatchrequest
);

router.get(
  "/help-desk/requests/card-printing/:request_id",
  getcardprintingrequestbyid
);

router.put(
  "/help-desk/requests/card-printing/printing/assign-user",
  cardprintingassign
);

router.put(
  "/help-desk/requests/card-printing/dispatch/assign-user",
  cardDispatchassign
);

// router.put("/employees/cards/:id/assign", assigncard);

router.get("/requests/exempt/all", getallemployeeexempt);

router.get("/requests/exempt/:request_id", getemployeeexemptbyid);

router.put("/adminuser/requests/exempt/assign", assignemployeeexempt);

module.exports = router;
