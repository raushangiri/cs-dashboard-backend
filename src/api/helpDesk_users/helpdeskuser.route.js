const express = require("express");
const router = express.Router();
const {
  getallkycrequest,
  getkycrequest,
  getallemployeekycrequest,
  getemployeekycrequest,
  getallreportrequest,
  getallenquiryrequest,
  getenquiryrequest,
  getreportrequest,
  getallcompanyrequest,
  getcompanyrequest,
  updatekycstatus,
  updateemployeekycstatus,
  updatereportstatus,
  updatecomanydocstatus,
  updateenquirystatus,
  getdashoboard,
  getassignuser,
  getassignuserbyid,
  updaterepresentativestatus,
  updaterepresentativedetailstatus,
  getalldeleterequest,
  updateemployeedeletedocumentstatus,
  updateemployeedeletestatus,
  cardprinting,
  cardprintingstatusupdate,
  carddispatch,
  carddispatchstatusupdate,
  employeeexemptrequest,
  employeeexemptrequestbyid,
  updateemployeeexemptstatus,
} = require("./helpdeskuses.controller");

router.get("/help-desk/:agent_id/request/kyc/all", getallkycrequest);

router.get("/help-desk/:agent_id/request/kyc/:_id", getkycrequest);

router.get(
  "/help-desk/:agent_id/request/employee/kyc/all",
  getallemployeekycrequest
);

router.get(
  "/help-desk/:agent_id/request/employee/kyc/:_id",
  getemployeekycrequest
);

router.get(
  "/help-desk/:agent_id/request/help-support/all",
  getallreportrequest
);

router.get("/help-desk/:agent_id/request/enquiry/all", getallenquiryrequest);

router.get("/help-desk/:agent_id/request/enquiry/:_id", getenquiryrequest);

router.get("/help-desk/:agent_id/request/help-support/:_id", getreportrequest);

router.get(
  "/help-desk/:agent_id/request/password-reset/all",
  getallcompanyrequest
);

router.get(
  "/help-desk/:agent_id/request/password-reset/:_id",
  getcompanyrequest
);

router.put("/help-desk/:agent_id/request/kyc/update/:_id", updatekycstatus);

router.put(
  "/help-desk/:agent_id/request/employee/kyc/update/:_id",
  updateemployeekycstatus
);

router.put(
  "/help-desk/:agent_id/request/report/update/:_id",
  updatereportstatus
);

router.put(
  "/help-desk/:agent_id/request/comapnydoc/update/:_id",
  updatecomanydocstatus
);

router.put("/help-desk/request/enquiry/update/:_id", updateenquirystatus);

router.get("/help-desk/:agent_id/task-analysis", getdashoboard);

router.get(
  "/help-desk/requests/change-representative/:helpdesk_id/all",
  getassignuser
);

router.get(
  "/help-desk/adminuser/:helpdesk_id/getassignbyid/:_id",
  getassignuserbyid
);

router.put(
  "/help-desk/:helpdesk_id/representative/update/:_id",
  updaterepresentativestatus
);

router.put(
  "/help-desk/request/change-representative/update/:request_id",
  updaterepresentativedetailstatus
);

router.get(
  "/help-desk/:helpdeskuser_id/requests/employee-delete/all",
  getalldeleterequest
);

router.put(
  "/help-desk/requests/employee-delete/:request_id/update",
  updateemployeedeletestatus
);

router.put(
  "/help-desk/requests/employee-delete/document/:request_id/update",
  updateemployeedeletedocumentstatus
);

router.get(
  "/help-desk/requests/card-printing/initiated/:agent_id/all",
  cardprinting
);

router.put(
  "/help-desk/requests/card-printing/initiated/update/:request_id",
  cardprintingstatusupdate
);

router.get(
  "/help-desk/requests/card-printing/shipping/:agent_id/all",
  carddispatch
);

router.put(
  "/help-desk/requests/card-printing/shipping/update/:request_id",
  carddispatchstatusupdate
);

router.get("/help-desk/requests/exempt/:agent_id/all", employeeexemptrequest);

// router.get("/help-desk/requests/exempt/:request_id", employeeexemptrequestbyid);

router.put("/help-desk/requests/exempt/update", updateemployeeexemptstatus);

module.exports = router;
