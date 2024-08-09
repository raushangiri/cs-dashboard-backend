const helpdesk_user = require("../../model/helpdesk_user.model");
const contactus = require("../../model/contactus.model");
const kyc = require("../../model/comapny_kyc_status.model");
const companyDoc = require("../../model/user.forgetpassword.model");
const employeekyc = require("../../model/employee_kyc_status");
const company = require("../../model/company.model");
const employee = require("../../model/employee.model");
const enquiry = require("../../model/enquiry.eelms");
const mangementrole = require("../../model/management_role.model");
const representative = require("../../model/change_representative.model");
const delete_employee_request = require("../../model/employee_delete_request.model");
const employee_archive = require("../../model/employee_archive");
const card_archive = require("../../model/card_archive.model");
const cardprint = require("../../model/card_printing.model");
const quota = require("../../model/quota.model");
const employee_exempt = require("../../model/employeexpempt.model");
const { all } = require("./helpdeskuser.route");
const jwt = require("jsonwebtoken");
const emailservices = require("../../services/email.service");
const card = require("../../model/card.model");
const secretkey = process.env.secretkey;
const resetPassword = process.env.reset_password;
const eel_portal_link = process.env.eel_portal_link;

// const getallrequest = async (req, res) => {
//   try {
//     const data = await kycdocs.aggregate([
//       { $match: { agent_id: req.params.agent_id } },
//       {
//         $lookup: {
//           from: "companydocs",
//           foreignField: "agent_id",
//           localField: "agent_id",
//           as: "companydocs_role",
//         },
//       },
//       { $unwind: "$companydocs_role" },
//       {
//         $lookup: {
//           from: "reportdatas",
//           foreignField: "agent_id",
//           localField: "agent_id",
//           as: "reportdatas_role",
//         },
//       },
//       { $unwind: "$reportdatas_role" },
//       {
//         $project: {
//           cac_doc: 1,
//           tcc_doc: 1,
//           expatriate_quota_position: 1,
//           additional_doc: 1,
//         },
//       },
//     ]);
//     return res.status(200).send({ status: 200, data });
//   } catch (error) {
//     return res.status(401).send({ status: 401, message: error.message });
//   }
// };

const getallkycrequest = async (req, res) => {
  try {
    const data = await kyc
      .find({
        agent_id: req.params.agent_id,
        allocation_date: req.query.date,
        request_status: "PENDING",
      })
      .lean();
    let useridArr = data.map((i) => i.userid);
    // console.log(useridArr);
    const comapnyData = await company
      .find({ userid: { $in: useridArr } })
      .lean();
    let jsonObj = [];
    data.forEach((i) => {
      let companyObj = {};
      companyObj = { ...i };
      // console.log(companyObj, "companyObj");
      comapnyData.map((j) => {
        if (i.userid === j.userid) {
          // console.log(i, "i");
          // console.log(j, "j");
          companyObj["rcNumber"] = j.rcNumber;
          companyObj["nameOfRepresentive"] = j.nameOfRepresentive;
          // console.log(companyObj, "companyObj");
        }
        return companyObj;
      });
      jsonObj.push(companyObj);
    });
    return res.status(200).send({ status: 200, data: jsonObj });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const getkycrequest = async (req, res) => {
  try {
    const data = await kyc.findOne({
      _id: req.params._id,
      agent_id: req.params.agent_id,
    });
    return res.status(200).send({ status: 200, data });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const getallemployeekycrequest = async (req, res) => {
  try {
    const data = await employeekyc.find({
      agent_id: req.params.agent_id,
      allocation_date: req.query.date,
      request_status: "PENDING",
    });
    // console.log(data, "data");
    return res.status(200).send({ status: 200, data });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const getemployeekycrequest = async (req, res) => {
  try {
    const data = await employeekyc.findOne({
      _id: req.params._id,
      agent_id: req.params.agent_id,
    });
    return res.status(200).send({ status: 200, data });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const getallreportrequest = async (req, res) => {
  try {
    const data = await contactus.find({
      agent_id: req.params.agent_id,
      allocation_date: req.query.date,
    });
    return res.status(200).send({ status: 200, data });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const getallenquiryrequest = async (req, res) => {
  try {
    const data = await enquiry.find({
      agent_id: req.params.agent_id,
      allocation_date: req.query.date,
    });
    return res.status(200).send({ status: 200, data });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const getenquiryrequest = async (req, res) => {
  try {
    const data = await enquiry.findOne({
      _id: req.params._id,
      agent_id: req.params.agent_id,
    });
    return res.status(200).send({ status: 200, data });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const getreportrequest = async (req, res) => {
  try {
    const data = await contactus.findOne({
      _id: req.params._id,
      agent_id: req.params.agent_id,
    });
    return res.status(200).send({ status: 200, data });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const getallcompanyrequest = async (req, res) => {
  try {
    const data = await companyDoc.find({
      agent_id: req.params.agent_id,
      allocation_date: req.query.date,
      request_status: false,
    });
    return res.status(200).send({ status: 200, data });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const getcompanyrequest = async (req, res) => {
  try {
    const data = await companyDoc.findOne({
      _id: req.params._id,
      agent_id: req.params.agent_id,
    });
    return res.status(200).send({ status: 200, data });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

// const updatekycstatus = async (req, res) => {
//   try {
//     const kycdata = await kyc
//       .findOne({ agent_id: req.params.agent_id, _id: req.params._id })
//       .lean();
//     // console.log(kycdata);

//     const inactiveKeys = Object.keys(kycdata).filter(
//       (key) => kycdata[key] === "REJECTED"
//     );
//     let lastkey = inactiveKeys[0];
//     console.log(inactiveKeys.length === 0 && req.body[lastkey] === "APPROVED");
//     if (
//       inactiveKeys.length === 0 &&
//       Object.values(req.body).includes("APPROVED")
//     ) {
//       console.log("in here");
//       const data = await kyc.updateOne(
//         { _id: req.params._id },
//         {
//           $set: req.body,
//           request_status: "APPROVED",
//         }
//       );
//       await company.updateOne(
//         { userid: kycdata.userid },
//         {
//           kyc_status: "APPROVED",
//         }
//       );
//       let subject = "EEL Account KYC confirmation";
//       let companyActive = `Dear ${kycdata.companyname},

// Thank you for registering with EEL Online portal. Your documents have been verified successfully.\n
// To check KYC status, kindly visit to EEL portal.\n
// ${eel_portal_link}
// This is an automated message, please do not reply.\n

// If you have any questions or concerns regarding EEL portal, please do not hesitate to contact our customer support team at enquiries.eel@eel.interior.gov.ng or +234-7080647200.\n

// Thank you,\n
// EEL Team `;
//       await emailservices.sendEmail(
//         kycdata.company_email,
//         subject,
//         companyActive
//       );
//       return res.status(200).send({ status: 200, message: "status updated" });
//     } else if (inactiveKeys.length > 1) {
//       const data = await kyc.updateOne(
//         { _id: req.params._id },
//         {
//           $set: req.body,
//         }
//       );
//       return res.status(200).send({ status: 200, message: "status updated" });
//     } else if (
//       inactiveKeys.length === 1 &&
//       Object.values(req.body).includes("REJECTED")
//     ) {
//       // console.log("in here1");
//       const data = await kyc.updateOne(
//         { _id: req.params._id },
//         {
//           $set: req.body,
//           request_status: "REJECTED",
//         }
//       );
//       await company.updateOne(
//         { userid: kycdata.userid },
//         {
//           kyc_status: "REJECTED",
//         }
//       );
//       const kycdataIn = await kyc
//         .findOne({ agent_id: req.params.agent_id, _id: req.params._id })
//         .lean();
//       // console.log(kycdataIn, "kycdata");
//       const inactiveKeysin = Object.keys(kycdata).filter(
//         (key) => kycdataIn[key] === "REJECTED"
//       );
//       // console.log(inactiveKeysin, "inactivekeys");
//       let filteredObj = {};
//       let sendremark = inactiveKeysin.forEach((key) => {
//         if (kycdata.hasOwnProperty(key)) {
//           filteredObj[key] = kycdataIn[key];
//           // filteredObj['cerpac_back_status'] ? kycdataIn['cerpac_back_status_remark'] : ""
//           filteredObj[key] = kycdataIn[`${key}_remark`];
//         }
//       });
//       // falsekeysKeys[`${inactiveKeys}`] = kycdataIn[`${inactiveKeys}_remark`];
//       // console.log(filteredObj, "filterobj");

//       let jsonString = JSON.stringify(filteredObj);
//       let formattedString = "";
//       for (const [key, value] of Object.entries(filteredObj)) {
//         formattedString += `${key}:"${value}", `;
//       }
//       // Remove the trailing comma and space
//       formattedString = formattedString.slice(0, -2);
//       // console.log(formattedString);
//       // Now you can send jsonString through email
//       console.log(jsonString);
//       let subject = "EEL KYC Status - Rejected";
//       let companyActive = `
//       Dear ${kycdata.companyname},

//       The KYC documents for ${kycdata.companyname} on EEL have been rejected due to the following reasons.\n
//        ${formattedString}\n

//       Kindly reupload the rejected documents for the company from the EEL portal.\n
//       If you have any questions, please do not hesitate to contact our customer support team at enquiries.eel@eel.interior.gov.ng, or enquiry@eelnigeria.com.ng.\n
//       You can also contact us on +234-7080647200, 02013303150  on weekdays Monday to Friday between 9:30 AM to 4:00 PM.\n

//       Thank you,
//       EEL Team

//       Note: This is an automated message, please do not reply to this message `;
//       await emailservices.sendEmail(
//         kycdata.company_email,
//         subject,
//         companyActive
//       );
//       return res.status(200).send({ status: 200, message: "status updated" });
//     } else {
//       console.log("INELSE");
//       const data = await kyc.updateOne(
//         { _id: req.params._id },
//         {
//           $set: req.body,
//         }
//       );
//       return res.status(200).send({ status: 200, message: "status updated" });
//     }
//     // console.log(inactiveKeys); // Output: ["cacdocument", "tccdocument", "itfdocument"]
//   } catch (error) {
//     return res.status(401).send({ status: 401, message: error.message });
//   }
// };

const updatekycstatus = async (req, res) => {
  try {
    const kycdata = await kyc
      .findOne(
        { agent_id: req.params.agent_id, _id: req.params._id },
        { request_status: 0 }
      )
      .lean();
    const rejectedKeys = Object.keys(kycdata).filter(
      (key) => kycdata[key] === "REJECTED"
    );

    const pendingKeys = Object.keys(kycdata).filter(
      (key) => kycdata[key] === "PENDING"
    );
    // console.log(pendingKeys, rejectedKeys, kycdata);
    if (
      rejectedKeys.length === 0 &&
      pendingKeys.length === 1 &&
      Object.values(req.body).includes("APPROVED")
    ) {
      console.log("in here");
      const data = await kyc.updateOne(
        { _id: req.params._id },
        {
          $set: req.body,
          request_status: "APPROVED",
        }
      );
      const keysToKeep = ["cac", "pancom", "itf", "tccnumber", "tcc"];
      const filteredObj = Object.fromEntries(
        Object.entries(kycdata).filter(([key, value]) =>
          keysToKeep.includes(key)
        )
      );
      // console.log(filteredObj, "filteredObj");
      await company.updateOne(
        { userid: kycdata.userid },
        {
          kyc_status: "APPROVED",
          $set: filteredObj,
        }
      );
      let subject = "EEL Account KYC confirmation";
      let companyActive = `Dear ${kycdata.companyname},

Thank you for registering with EEL Online portal. Your documents have been verified successfully.\n
To check KYC status, kindly visit to EEL portal.\n
${eel_portal_link}
This is an automated message, please do not reply.\n

If you have any questions or concerns regarding EEL portal, please do not hesitate to contact our customer support team at enquiries.eel@eel.interior.gov.ng or +234-7080647200.\n

Thank you,\n
EEL Team `;
      await emailservices.sendEmail(
        kycdata.company_email,
        subject,
        companyActive
      );
      return res.status(200).send({ status: 200, message: "status updated" });
    } else if (
      pendingKeys.length === 1 &&
      Object.values(req.body).includes("REJECTED")
    ) {
      // console.log("in here1");
      const data = await kyc.updateOne(
        { _id: req.params._id },
        {
          $set: req.body,
          request_status: "REJECTED",
        }
      );
      await company.updateOne(
        { userid: kycdata.userid },
        {
          kyc_status: "REJECTED",
        }
      );
      const kycdataIn = await kyc
        .findOne({ agent_id: req.params.agent_id, _id: req.params._id })
        .lean();
      // console.log(kycdataIn, "kycdata");
      const inactiveKeysin = Object.keys(kycdata).filter(
        (key) => kycdataIn[key] === "REJECTED"
      );
      // console.log(inactiveKeysin, "inactivekeys");
      let filteredObj = {};
      let sendremark = inactiveKeysin.forEach((key) => {
        if (kycdata.hasOwnProperty(key)) {
          filteredObj[key] = kycdataIn[key];
          // filteredObj['cerpac_back_status'] ? kycdataIn['cerpac_back_status_remark'] : ""
          filteredObj[key] = kycdataIn[`${key}_remark`];
        }
      });
      // console.log(filteredObj, "filterobj");
      let jsonString = JSON.stringify(filteredObj);
      let formattedString = "";
      for (const [key, value] of Object.entries(filteredObj)) {
        formattedString += `${key}:"${value}", `;
      }
      // Remove the trailing comma and space
      formattedString = formattedString.slice(0, -2);
      // console.log(formattedString);
      // console.log(jsonString);
      let subject = "EEL KYC Status - Rejected";
      let companyActive = `
      Dear ${kycdata.companyname},

      The KYC documents for ${kycdata.companyname} on EEL have been rejected due to the following reasons.\n
       ${formattedString}\n

      Kindly reupload the rejected documents for the company from the EEL portal.\n
      If you have any questions, please do not hesitate to contact our customer support team at enquiries.eel@eel.interior.gov.ng, or enquiry@eelnigeria.com.ng.\n
      You can also contact us on +234-7080647200, 02013303150  on weekdays Monday to Friday between 9:30 AM to 4:00 PM.\n

      Thank you,
      EEL Team

      Note: This is an automated message, please do not reply to this message `;
      await emailservices.sendEmail(
        kycdata.company_email,
        subject,
        companyActive
      );
      return res.status(200).send({ status: 200, message: "status updated" });
    } else {
      // console.log("INELSE");
      const data = await kyc.updateOne(
        { _id: req.params._id },
        {
          $set: req.body,
        }
      );
      return res.status(200).send({ status: 200, message: "status updated" });
    }
    // console.log(inactiveKeys); // Output: ["cacdocument", "tccdocument", "itfdocument"]
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

// const updateemployeekycstatus = async (req, res) => {
//   try {
//     const kycdata = await employeekyc
//       .findOne({ agent_id: req.params.agent_id, _id: req.params._id })
//       .lean();
//     // console.log(kycdata);
//     // let companyName = await company.findOne({ userid: kycdata.userid }).lean();
//     const inactiveKeys = Object.keys(kycdata).filter(
//       (key) => kycdata[key] === "inactive"
//     );
//     let lastkey = inactiveKeys[0];
//     // console.log(inactiveKeys.length, req.body[lastkey], "inactiveKeys");

//     if (inactiveKeys.length === 1 && req.body[lastkey] === "active") {
//       // console.log("in1");
//       const data = await employeekyc.updateOne(
//         { _id: req.params._id },
//         {
//           $set: req.body,
//           request_status: true,
//         }
//       );
//       await employee.updateOne(
//         { empemail: kycdata.email },
//         {
//           kyc_status: true,
//         }
//       );

//       let subject = " Employee KYC rejection-EEL PORTAL";
//       let employeeActive = `
//       Dear ${kycdata.company_name},

//       This is confirmation email to inform you that document for your employee ${kycdata.givenname} ${kycdata.surname}  has been verified successfully.\n
//       To check KYC status, kindly visit to EEL portal’s employee section.\n
//      ${eel_portal_link}
//       This is an automated message, please do not reply.\n

//       If you have any questions or concerns regarding EEL portal, please do not hesitate to contact our customer support team at enquiries.eel@eel.interior.gov.ng or +234-7080647200.\n

//       Thank you,\n
//       EEL Team
//       `;
//       await emailservices.sendEmail(kycdata.email, subject, employeeActive);

//       return res.status(200).send({ status: 200, message: "status updated" });
//     } else if (inactiveKeys.length > 1) {
//       // console.log("in here");
//       // console.log(req.body);
//       const data = await employeekyc.updateOne(
//         { _id: req.params._id },
//         {
//           $set: req.body,
//         }
//       );
//       return res.status(200).send({ status: 200, message: "status updated" });
//     } else if (inactiveKeys.length === 1 && req.body[lastkey] === "inactive") {
//       // console.log("in2");
//       const data = await employeekyc.updateOne(
//         { _id: req.params._id },
//         {
//           $set: req.body,
//           request_status: false,
//         }
//       );
//       await employee.updateOne(
//         { empemail: kycdata.email },
//         {
//           kyc_status: false,
//         }
//       );
//       let subject = " Employee KYC rejection-EEL PORTAL";
//       let employeeActive = `
//       Dear ${kycdata.company_name},

//       This is confirmation email to inform you that document for your employee [Employee name] has been verified successfully.\n
//       To check KYC status, kindly visit to EEL portal’s employee section.\n
//      ${eel_portal_link}
//       This is an automated message, please do not reply.\n

//       If you have any questions or concerns regarding EEL portal, please do not hesitate to contact our customer support team at enquiries.eel@eel.interior.gov.ng or +234-7080647200.\n

//       Thank you,\n
//       EEL Team
//       `;
//       await emailservices.sendEmail(kycdata.email, subject, employeeActive);

//       return res.status(200).send({ status: 200, message: "status updated" });
//     }
//   } catch (error) {
//     return res.status(401).send({ status: 401, message: error.message });
//   }
// };

const updateemployeekycstatus = async (req, res) => {
  try {
    const kycdata = await employeekyc
      .findOne(
        { agent_id: req.params.agent_id, _id: req.params._id },
        { request_status: 0 }
      )
      .lean();
    // console.log(kycdata, "kycdata");
    // let companyName = await company.findOne({ userid: kycdata.userid }).lean();
    const rejectedKeys = Object.keys(kycdata).filter(
      (key) => kycdata[key] === "REJECTED"
    );
    let lastkey = rejectedKeys[0];
    const pendingKeys = Object.keys(kycdata).filter(
      (key) => kycdata[key] === "PENDING"
    );

    // console.log(rejectedKeys.length, rejectedKeys, lastkey, "rejectedKeys");
    if (
      rejectedKeys.length === 0 &&
      pendingKeys.length === 1 &&
      Object.values(req.body).includes("APPROVED")
    ) {
      console.log("in1");
      const data = await employeekyc.updateOne(
        { _id: req.params._id },
        {
          $set: req.body,
          request_status: "APPROVED",
        }
      );

      const keysToKeep = [
        "uploadpassport",
        "passportnumber",
        "passportexpiry",
        "visa_document",
        "visatype",
        "visanumber",
        "visaexpiracy",
        "cerpac_back",
        "cerpac_front",
        "cerpac_expiry",
        "cerpac_number",
      ];
      const filteredObj = Object.fromEntries(
        Object.entries(kycdata).filter(([key, value]) =>
          keysToKeep.includes(key)
        )
      );
      // console.log(filteredObj, "filteredObj");
      await employee.updateOne(
        { empemail: kycdata.email },
        {
          kyc_status: "APPROVED",
          $set: filteredObj,
        }
      );
      let subject = " Employee KYC confirmation-EEL PORTAL";
      let employeeActive = `
      Dear ${kycdata.company_name}, 
      
      This is confirmation email to inform you that document for your employee ${kycdata.givenname} ${kycdata.surname} has been verified successfully.\n
      To check KYC status, kindly visit to EEL portal’s employee section.\n
     ${eel_portal_link}
      This is an automated message, please do not reply.\n 
      
      If you have any questions or concerns regarding EEL portal, please do not hesitate to contact our customer support team at enquiries.eel@eel.interior.gov.ng or +234-7080647200.\n 
      
      
      Thank you,\n 
      EEL Team 
      `;
      await emailservices.sendEmail(kycdata.email, subject, employeeActive);
      return res.status(200).send({ status: 200, message: "status updated" });
    } else if (
      pendingKeys.length === 1 &&
      Object.values(req.body).includes("REJECTED")
    ) {
      console.log("in2");
      const data = await employeekyc.updateOne(
        { _id: req.params._id },
        {
          $set: req.body,
          request_status: "REJECTED",
        }
      );
      await employee.updateOne(
        { empemail: kycdata.email },
        {
          kyc_status: "REJECTED",
        }
      );
      const kycdataIn = await employeekyc
        .findOne({ agent_id: req.params.agent_id, _id: req.params._id })
        .lean();
      // console.log(kycdataIn, "kycdata");
      const inactiveKeysin = Object.keys(kycdata).filter(
        (key) => kycdataIn[key] === "REJECTED"
      );
      // console.log(inactiveKeysin, "inactivekeys");
      let filteredObj = {};
      let sendremark = inactiveKeysin.forEach((key) => {
        if (kycdata.hasOwnProperty(key)) {
          filteredObj[key] = kycdataIn[key];
          // filteredObj['cerpac_back_status'] ? kycdataIn['cerpac_back_status_remark'] : ""
          filteredObj[key] = kycdataIn[`${key}_remark`];
        }
      });
      // falsekeysKeys[`${inactiveKeys}`] = kycdataIn[`${inactiveKeys}_remark`];
      // console.log(filteredObj, "filterobj");

      let formattedString = "";
      for (const [key, value] of Object.entries(filteredObj)) {
        formattedString += `${key}:"${value}", `;
      }
      // Remove the trailing comma and space
      formattedString = formattedString.slice(0, -2);

      let subject = "EEL Employee KYC Status - Rejected";
      let employeeActive = `
Dear ${kycdataIn.company_name},\n
                    
The KYC documents for ${kycdataIn.givenname} ${kycdataIn.surname} on EEL have been rejected due to the following reasons.\n
 ${formattedString}\n
Kindly reupload the rejected documents for the employee from the EEL portal.\n
If you have any questions, please do not hesitate to contact our customer support team at enquiries.eel@eel.interior.gov.ng, or   ${eel_portal_link}.\n

You can also contact us on +234-7080647200, 02013303150  on weekdays Monday to Friday between 9:30 AM to 4:00 PM.\n

Thank you, 
EEL Team \n

Note: This is an automated message, please do not reply to this message
                          `;
      await emailservices.sendEmail(kycdataIn.email, subject, employeeActive);

      return res.status(200).send({ status: 200, message: "status updated" });
    }
    //  if (inactiveKeys.length > 1)
    else {
      console.log("in here");
      // console.log(req.body);
      const data = await employeekyc.updateOne(
        { _id: req.params._id },
        {
          $set: req.body,
        }
      );
      return res.status(200).send({ status: 200, message: "status updated" });
    }
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const updatereportstatus = async (req, res) => {
  try {
    const data = await contactus.updateOne(
      { _id: req.params._id },
      {
        $set: req.body,
      }
    );
    return res.status(200).send({ status: 200, message: "status updated" });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const updateenquirystatus = async (req, res) => {
  try {
    const email = await enquiry.findOne({ _id: req.params._id }).lean();
    const data = await enquiry.updateOne(
      { _id: req.params._id },
      {
        $set: req.body,
        request_status: true,
      }
    );
    let text = req.body.reply;
    let subject = "contactus@eelnigeria.com.ng";
    await emailservices.sendContactEmail(email.user_email, subject, text);
    return res.status(200).send({ status: 200, message: "status updated" });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const updatecomanydocstatus = async (req, res) => {
  try {
    const kycdata = await companyDoc
      .findOne({ agent_id: req.params.agent_id, _id: req.params._id })
      .lean();
    // console.log(kycdata);

    const inactiveKeys = Object.keys(kycdata).filter(
      (key) => kycdata[key] === "inactive"
    );
    // console.log(inactiveKeys, "inactiveKeys");

    let lastkey = inactiveKeys[0];
    // console.log(req.body[lastkey], lastkey,"lastkey");
    if (inactiveKeys.length === 1 && req.body[lastkey] === "active") {
      const data = await companyDoc.updateOne(
        { _id: req.params._id },
        {
          $set: req.body,
          request_status: true,
        }
      );
      const token = jwt.sign({ businessEmail: kycdata.email }, secretkey, {
        expiresIn: "24hrs",
      });
      let subject = "change password";
      let text = `click on this link to rest password ${resetPassword}/${token}`;
      await emailservices.sendEmail(kycdata.email, subject, text);
      return res.status(200).send({ status: 200, message: "status updated" });
    } else if (inactiveKeys.length === 1 && req.body[lastkey] === "inactive") {
      const data = await companyDoc.updateOne(
        { _id: req.params._id },
        {
          $set: req.body,
          request_status: true,
        }
      );
      return res.status(200).send({ status: 200, message: "status updated" });
    } else {
      const data = await companyDoc.updateOne(
        { _id: req.params._id },
        {
          $set: req.body,
        }
      );
      return res.status(200).send({ status: 200, message: "status updated" });
    }
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const getdashoboard = async (req, res) => {
  try {
    const kycData = await kyc.aggregate([
      {
        $match: {
          agent_id: req.params.agent_id,
          request_status: "PENDING",
          allocation_date: req.query.date,
        },
      },
      // {
      //   $lookup: {
      //     from: "emplyee_kycs",
      //     localField: "agent_id",
      //     foreignempkyc: "agent_id",
      //     as: "empkyc_role",
      //   },
      // },
      // {
      //   $unwind: "$empkyc_role",
      // },
      // {
      //   agent_id: "$empkyc_role.agent_id",
      //   request_status: false,
      //   allocation_date: "$empkyc_role.allocation_date",
      // },
      // {
      //   $lookup: {
      //     from: "companydocs",
      //     localField: "agent_id",
      //     foreignempkyc: "agent_id",
      //     as: "companydocs_role",
      //   },
      // },
      // {
      //   $unwind: "$companydocs_role",
      // },
      // {
      //   agent_id: "$companydocs_role.agent_id",
      //   request_status: false,
      //   allocation_date: "$companydocs_role.allocation_date",
      // },
      // {
      //   $lookup: {
      //     from: "contactreports",
      //     localField: "agent_id",
      //     foreignempkyc: "agent_id",
      //     as: "contactreports_role",
      //   },
      // },
      // {
      //   $unwind: "$contactreports_role",
      // },
      // {
      //   agent_id: "$contactreports_role.agent_id",
      //   request_status: false,
      //   allocation_date: "$contactreports_role.allocation_date",
      // },
      // {
      //   $project: {},
      // },
    ]);
    // .lean();
    // console.log(kycData, "kycda");

    // console.log(kycData.length);
    // Object.keys(kycData).forEach((i) => {
    //   // console.log(i);
    //   if (i.indexOf("agent_id") !== -1) {
    //     pending_kyc_requests.push(i);
    //   } else if (i.indexOf("agent_id") === -1) {
    //     allocated_kyc_requests.push(i);
    //   }
    // });

    const companyDocData = await companyDoc.aggregate([
      {
        $match: {
          agent_id: req.params.agent_id,
          request_status: false,
          allocation_date: req.query.date,
        },
      },
    ]);
    //   .lean();
    // console.log(companyDocData, "company");

    // console.log(companyDocData.length);

    // Object.keys(conpanyDocData).forEach((i) => {
    //   // console.log(i);
    //   if (i.indexOf("agent_id") !== -1) {
    //     total_compnaydoc_requests.push(i);
    //   } else if (i.indexOf("agent_id") === -1) {
    //     allocated_compnaydoc_requests.push(i);
    //   }
    // });

    const employeeKycData = await employeekyc.aggregate([
      {
        $match: {
          agent_id: req.params.agent_id,
          request_status: "PENDING",
          allocation_date: req.query.date,
        },
      },
    ]);
    //   .lean();
    // console.log(employeeKycData, "emplyee");

    // console.log(employeeKycData.length);

    // Object.keys(emplyeeKycData).forEach((i) => {
    //   // console.log(i);
    //   if (i.indexOf("agent_id") !== -1) {
    //     total_emp_kyc_requests.push(i);
    //   } else if (i.indexOf("agent_id") === -1) {
    //     allocated_emp_kyc_requests.push(i);
    //   }
    // });

    const reportData = await contactus.aggregate([
      {
        $match: {
          agent_id: req.params.agent_id,
          request_status: false,
          allocation_date: req.query.date,
        },
      },
    ]);
    //   .lean();
    // console.log(reportData, "report");

    // console.log(reportData.length);

    // Object.keys(reportData).forEach((i) => {
    //   // console.log(i);
    //   if (i.indexOf("agent_id") !== -1) {
    //     total_reports_requests.push(i);
    //   } else if (i.indexOf("agent_id") === -1) {
    //     allocated_reports_requests.push(i);
    //   }
    // });
    // console.log(pending_kyc_requests.length);
    // console.log(allocated_kyc_requests.length);
    // console.log(total_compnaydoc_requests.length);
    // console.log(allocated_compnaydoc_requests.length);
    let total_pending_requests_count =
      kycData.length +
      companyDocData.length +
      employeeKycData.length +
      reportData.length;
    let alldata = {
      total_pending_requests_count,
      total_kyc_requests_count: kycData.length,
      total_help_support_requests_count: reportData.length,
      // total_email_support_requests_count,
      total_password_reset_requests_count: companyDocData.length,
      total_employee_kyc_requests_count: employeeKycData.length,
    };
    return res.status(200).send({ status: 200, data: alldata });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

// const getassignuser = async (req, res) => {
//   try {
//     const data = await mangementrole
//       .find({ helpdeskAgent_id: req.params.helpdesk_id })
//       .lean();
//     let mangemtnids = data.map((i) => i.representative_request_id);
//     console.log(mangemtnids);
//     let represetativedata = await representative
//       .find({
//         _id: { $in: mangemtnids },
//       })
//       .lean();
//     // let datafiles = [...data];
//     console.log(data, "datafiles");
//     console.log(represetativedata, "files");

//     let jsonObj = [];
//     data.forEach((i) => {
//       let companyObj = {};
//       companyObj = { ...i };
//       // console.log(companyObj, "companyObj");
//       represetativedata.map((j) => {
//         if (i.userid === j.userid) {
//           companyObj["company_name"] = j.companyName;
//           companyObj["business_email"] = j.business_email;
//           companyObj["helpdeskAgent_details_status"] =
//             i.helpdeskAgent_details_status;
//           companyObj["helpdesk_cac_docurl_status"] =
//             i.helpdesk_cac_docurl_status;
//           companyObj["helpdesk_other_docurl_status"] =
//             i.helpdesk_other_docurl_status;

//           // companyObj["request_date"] =
//           // companyObj["request_status"]
//           // id

//           // console.log(i, "i");
//           // console.log(j, "j");
//           // companyObj["cac_file_url"] = j.cac_file_url;
//           // companyObj["other_file_url"] = j.other_file_url;
//           // console.log(companyObj, "companyObj");
//         }
//         // return companyObj;
//       });
//       jsonObj.push(companyObj);
//     });
//     if (data) {
//       return res.status(200).send({ status: 200, data: jsonObj });
//     } else {
//       return res.status(203).send({ status: 203, message: "user not found" });
//     }
//   } catch (error) {
//     return res.status(401).send({ status: 401, message: error.message });
//   }
// };

const getassignuser = async (req, res) => {
  try {
    const data = await mangementrole
      .find({ helpdeskAgent_id: req.params.helpdesk_id })
      .lean();
    let mangemtnids = data.map((i) => i.representative_request_id);
    // console.log(mangemtnids);
    let represetativedata = await representative
      .find({
        _id: { $in: mangemtnids },
      })
      .lean();
    // let datafiles = [...data];
    // console.log(data, "datafiles");
    // console.log(represetativedata, "files");
    let output = {
      data: data.map((datafile) => {
        let matchingFile = represetativedata.find(
          (file) => file._id.toString() === datafile.representative_request_id
        );
        if (matchingFile) {
          return {
            ...datafile,

            company_name: matchingFile.companyName,
            business_email: matchingFile.old_business_email,
          };
        } else {
          return datafile;
        }
      }),
    };

    // console.log(output);
    if (data) {
      return res.status(200).send({ status: 200, data: output.data });
    } else {
      return res.status(203).send({ status: 203, message: "user not found" });
    }
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const getassignuserbyid = async (req, res) => {
  try {
    const data = await mangementrole
      .findOne({ helpdeskAgent_id: req.params.helpdesk_id })
      .lean();
    // console.log(data);
    let represetativedata = await representative
      .findOne({
        _id: data.representative_request_id,
      })
      .lean();
    // let datafiles = [...data];
    // console.log(represetativedata.cac_file_url, "datafiles");

    let jsonObj = [];
    // data.forEach((i) => {
    let companyObj = {};
    companyObj = { ...data };
    // console.log(companyObj, "companyObj");
    // represetativedata.map((j) => {
    //   if (i.userid === j.userid) {
    // console.log(i, "i");
    // console.log(j, "j");
    companyObj["cac_file_url"] = represetativedata.cac_file_url;
    companyObj["other_file_url"] = represetativedata.other_file_url;
    // console.log(companyObj, "companyObj");
    // }
    // return companyObj;
    // });
    //   jsonObj.push(companyObj);
    // });
    if (data) {
      return res.status(200).send({ status: 200, data: jsonObj });
    } else {
      return res.status(203).send({ status: 203, message: "user not found" });
    }
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const updaterepresentativestatus = async (req, res) => {
  try {
    const representativedata = await mangementrole
      .findOne({
        helpdeskAgent_id: req.params.helpdesk_id,
        _id: req.params._id,
      })
      .lean();
    // console.log(representativedata);
    // let companyName = await company.findOne({ userid: kycdata.userid }).lean();
    const inactiveKeys = Object.keys(representativedata).filter(
      (key) => representativedata[key] === "PENDING" || "ASSIGN"
    );
    let lastkey = inactiveKeys[0];
    // console.log(inactiveKeys.length, req.body[lastkey], "inactiveKeys");

    if (inactiveKeys.length === 1 && req.body[lastkey] === "APPROVED") {
      // console.log("in1");
      const data = await mangementrole.updateOne(
        { _id: req.params._id },
        {
          $set: req.body,
          request_status: "APPROVED",
        }
      );
      await representative.updateOne(
        { _id: representativedata.representative_request_id },
        {
          request_status: true,
        }
      );

      // let subject = " Employee KYC confirmation-EEL PORTAL";
      // let employeeActive = `
      //   Dear ${kycdata.company_name},

      //   This is confirmation email to inform you that document for your employee [Employee name] has been verified successfully.\n
      //   To check KYC status, kindly visit to EEL portal’s employee section.\n
      //  ${eel_portal_link}
      //   This is an automated message, please do not reply.\n

      //   If you have any questions or concerns regarding EEL portal, please do not hesitate to contact our customer support team at enquiries.eel@eel.interior.gov.ng or +234-7080647200.\n

      //   Thank you,\n
      //   EEL Team
      //   `;
      // await emailservices.sendEmail(kycdata.email, subject, employeeActive);

      return res.status(200).send({ status: 200, message: "status updated" });
    } else if (inactiveKeys.length > 1) {
      // console.log("in here");
      // console.log(req.body);
      const data = await mangementrole.updateOne(
        { _id: req.params._id },
        {
          $set: req.body,
        }
      );
      return res.status(200).send({ status: 200, message: "status updated" });
    } else if (inactiveKeys.length === 1 && req.body[lastkey] === "REJECTED") {
      // console.log("in2");
      const data = await mangementrole.updateOne(
        { _id: req.params._id },
        {
          $set: req.body,
          request_status: "REJECTED",
        }
      );

      await emailservices.sendEmail(
        representativedata.new_business_email,
        "change represetative request rejected",
        "yor achange representative request has been rejecte by head office"
      );
      await emailservices.sendEmail(
        representativedata.old_business_email,
        "change represetative request rejected",
        "yor achange representative request has been rejecte by head office"
      );

      return res.status(200).send({ status: 200, message: "status updated" });
      // } else if (representativedata.request_status === "REJECTED") {
      //   return res
      //     .status(200)
      //     .send({ status: 200, message: "document has been rejected" });
    }
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const updaterepresentativedetailstatus = async (req, res) => {
  try {
    const representativedata = await mangementrole
      .findOne({
        // helpdeskAgent_id: req.params.helpdesk_id,
        _id: req.params.request_id,
      })
      .lean();
    // console.log(representativedata);
    // let companyName = await company.findOne({ userid: kycdata.userid }).lean();
    const inactiveKeys = Object.keys(representativedata).filter(
      (key) => representativedata[key] === "PENDING" || "ASSIGN"
    );
    let lastkey = inactiveKeys[0];
    // console.log(inactiveKeys.length, req.body[lastkey], "inactiveKeys");

    if (inactiveKeys.length === 1 && req.body[lastkey] === "APPROVED") {
      // console.log("in1");
      const data = await mangementrole.updateOne(
        { _id: req.params._id },
        {
          $set: req.body,
          request_status: "ASSIGN",
        }
      );
      await representative.updateOne(
        { _id: representativedata.representative_request_id },
        {
          request_status: false,
        }
      );

      // let subject = " Employee KYC confirmation-EEL PORTAL";
      // let employeeActive = `
      //   Dear ${kycdata.company_name},

      //   This is confirmation email to inform you that document for your employee [Employee name] has been verified successfully.\n
      //   To check KYC status, kindly visit to EEL portal’s employee section.\n
      //  ${eel_portal_link}
      //   This is an automated message, please do not reply.\n

      //   If you have any questions or concerns regarding EEL portal, please do not hesitate to contact our customer support team at enquiries.eel@eel.interior.gov.ng or +234-7080647200.\n

      //   Thank you,\n
      //   EEL Team
      //   `;
      // await emailservices.sendEmail(kycdata.email, subject, employeeActive);

      return res.status(200).send({ status: 200, message: "status updated" });
    } else if (inactiveKeys.length > 1) {
      // console.log("in here");
      // console.log(req.body);
      const data = await mangementrole.updateOne(
        { _id: req.params.request_id },
        {
          $set: req.body,
        }
      );
      return res.status(200).send({ status: 200, message: "status updated" });
    } else if (inactiveKeys.length === 1 && req.body[lastkey] === "REJECTED") {
      // console.log("in2");
      const data = await mangementrole.updateOne(
        { _id: req.params.request_id },
        {
          $set: req.body,
          request_status: "REJECTED",
        }
      );

      emailservices.sendEmail(
        adminUserData.email,
        "change represetative request rejected",
        "yor achange representative request has been rejecte by head office"
      );
      return res.status(200).send({ status: 200, message: "status updated" });
      // } else if (representativedata.request_status === "REJECTED") {
      //   return res
      //     .status(200)
      //     .send({ status: 200, message: "document has been rejected" });
    }
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const getalldeleterequest = async (req, res) => {
  try {
    const data = await delete_employee_request.find({
      agent_id: req.params.helpdeskuser_id,
    });
    return res.status(200).send({ status: 200, data });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const updateemployeedeletedocumentstatus = async (req, res) => {
  try {
    // console.log(req.params.request_id, "id");
    const data = await delete_employee_request.findOne({
      _id: req.params.request_id,
    });
    // console.log(data, Object.values(req.body).includes("APPROVED"));
    if (Object.values(req.body).includes("APPROVED")) {
      const updateStatus = await delete_employee_request.updateMany(
        {
          _id: req.params.request_id,
        },
        {
          $set: req.body,
        }
      );
      return res
        .status(200)
        .send({ status: 200, message: "status updated successfully" });
    } else if (Object.values(req.body).includes("REJECTED")) {
      const updateStatus = await delete_employee_request.updateMany(
        {
          _id: req.params.request_id,
        },
        {
          $set: req.body,
        }
      );
      return res
        .status(200)
        .send({ status: 200, message: "status updated successfully" });
    }
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const updateemployeedeletestatus = async (req, res) => {
  try {
    // console.log(":here");
    const data = await delete_employee_request.findOne({
      _id: req.params.request_id,
    });
    // console.log(data, ":data");
    if (!data) {
      return res.status(200).send({
        status: 200,
        message: "request is not raised",
      });
    } else {
      const empdata = await employee.findOne({ _id: data.employee_id }).lean();
      // console.log(empdata._id.toString(), ":empdata");
      if (
        Object.values(req.body).includes("APPROVED") &&
        Object.keys(req.body).includes("request_status")
      ) {
        if (!empdata) {
          return res.status(400).send({
            status: 400,
            message: "employee  has alreday been deleted",
          });
        } else {
          const cardData = await card
            .findOne({ emp_registration_id: empdata._id })
            .lean();
          // console.log(cardData, ":cardData");
          if (!cardData) {
            return res.status(400).send({
              status: 400,
              message: "employee card is not created",
            });
          } else {
            let objdata = {};
            objdata = { ...empdata };
            objdata["employee_id"] = objdata._id.toString();
            delete objdata._id;
            let cardObj = {};
            cardObj = { ...cardData };
            cardObj["card_id"] = cardObj._id.toString();
            delete cardObj._id;
            // console.log(cardObj, "cardObj");
            // console.log(employeedeleted, "employeedeleted");
            const updateStatus = await delete_employee_request.updateMany(
              {
                _id: req.params.request_id,
              },
              {
                $set: req.body,
              }
            );
            const deleteEmployeeData = await employee.findOneAndDelete({
              _id: data.employee_id,
            });
            const moveEmployeeData = await employee_archive.create(objdata);
            const moveCardData = await card_archive.create(cardObj);
            const quotaupdate = await quota.updateOne(
              {
                "position.quotaId": objdata.quotaId,
                "position.Position": objdata.position,
              },
              {
                $inc: { "position.$.utillizedslots": -1 },
              }
            );

            const updatecard = await card.updateMany(
              {
                emp_registration_id: empdata._id.toString(),
              },
              {
                $set: {
                  emp_registration_id: "",
                  emp_profile_photo: "",
                  card_issue_date: "",
                  mereg_no: "",
                  card_holder_name: "",
                  nationality: "",
                  passport_number: "",
                  cerpac_number: "",
                  cerpac_validity: "",
                  passport_validaity: "",
                },
              }
            );
            return res
              .status(200)
              .send({ status: 200, message: "status updated successfully" });
          }
        }
      } else if (
        Object.values(req.body).includes("REJECTED") &&
        Object.keys(req.body).includes("request_status")
      ) {
        const updateStatus = await delete_employee_request.updateOne(
          {
            _id: req.params.request_id,
          },
          {
            $set: req.body,
            request_status: "REJECTED",
          }
        );
        const updateemployee = await employee.updateOne(
          { _id: data.employee_id },
          {
            $set: { empstatus: ["Active"] },
          }
        );
        // console.log("here");
        return res
          .status(200)
          .send({ status: 200, message: "status updated successfully" });
      } else {
        const updateStatus = await delete_employee_request.updateMany(
          {
            _id: req.params.request_id,
          },
          {
            $set: req.body,
          }
        );
        return res
          .status(200)
          .send({ status: 200, message: "status updated successfully" });
      }
    }
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const cardprinting = async (req, res) => {
  try {
    const data = await cardprint.find(
      {
        request_status: "INITIATED",
        printing_agent_id: req.params.agent_id,
      },
      {
        company_name: 1,
        company_email: 1,
        emp_full_name: 1,
        request_date: 1,
        request_status: 1,
        card_number: 1,
      }
    );
    return res.status(200).send({ status: 200, data });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const cardprintingstatusupdate = async (req, res) => {
  try {
    const data = await cardprint.updateOne(
      {
        _id: req.params.request_id,
      },
      { $set: req.body }
    );
    return res
      .status(200)
      .send({ status: 200, message: "status updated successfully" });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const carddispatch = async (req, res) => {
  try {
    const data = await cardprint.find(
      {
        request_status: "SHIPPING",
        dispatching_agent_id: req.params.agent_id,
      },
      {
        company_name: 1,
        company_email: 1,
        emp_full_name: 1,
        request_date: 1,
        request_status: 1,
        card_number: 1,
      }
    );
    // console.log(data);
    return res.status(200).send({ status: 200, data });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const carddispatchstatusupdate = async (req, res) => {
  try {
    const data = await cardprint.updateOne(
      {
        _id: req.params.request_id,
      },
      { $set: req.body }
    );
    return res
      .status(200)
      .send({ status: 200, message: "status updated successfully" });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const employeeexemptrequest = async (req, res) => {
  try {
    const data = await employee_exempt
      .find({
        helpdesk_agent_id: req.params.agent_id,
        request_status: "ASSIGN",
      })
      .lean();
    return res.status(200).send({ status: 200, data });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const employeeexemptrequestbyid = async (req, res) => {
  try {
    const data = await employee_exempt
      .find({ _id: req.params.request_id })
      .lean();
    return res.status(200).send({ status: 200, data });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const updateemployeeexemptstatus = async (req, res) => {
  try {
    if (Object.values(req.body).includes("REJECTED")) {
      const data = await employee_exempt.updateOne(
        {
          _id: req.body._id,
        },
        {
          $set: req.body,
          request_status: "REJECTED",
        }
      );
      return res
        .status(200)
        .send({ status: 200, message: "status updated successfully" });
    } else if (Object.values(req.body).includes("APPROVED")) {
      const data = await employee_exempt.updateOne(
        {
          _id: req.body._id,
        },
        {
          $set: req.body,
        }
      );
      return res
        .status(200)
        .send({ status: 200, message: "status updated successfully" });
    }
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

module.exports = {
  getallkycrequest,
  getkycrequest,
  getallemployeekycrequest,
  getemployeekycrequest,
  getallenquiryrequest,
  getenquiryrequest,
  getallreportrequest,
  getreportrequest,
  getallcompanyrequest,
  getcompanyrequest,
  updatekycstatus,
  updateemployeekycstatus,
  updatereportstatus,
  updateenquirystatus,
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
};
