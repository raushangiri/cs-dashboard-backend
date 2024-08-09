const managementrole = require("../../model/management_role.model");
const representative = require("../../model/change_representative.model");
const adminusers = require("../../model/admin_users.model");
const employee_exempt = require("../../model/employeexpempt.model");
const { ctogetresponse } = require("./admin.cto.service");
const jwt = require("jsonwebtoken");
const secretkey = process.env.secretkey;
const emailservices = require("../../services/email.service");
const bcrypt = require("bcrypt");
const generateUniqueAlphanumeric = require("../payment/payment.service");
const serverUI = process.env.pdf_uri;
const resetPassword = process.env.reset_password;
let eel_portal_link = process.env.eel_portal_link;
const moment = require("moment");
const { request } = require("express");

const ctogetalldata = async (req, res) => {
  try {
    const assigndata = await managementrole.find({
      $or: [{ request_status: "ASSIGN" }, { request_status: "APPROVED" }],
    });
    // console.log(assigndata);
    const representativeData = await representative
      .find({ request_status: false })
      .lean();
    const agentname = await adminusers.find({}).lean();
    // let representativedata = [...representativeData];
    // let assign = [...assigndata];
    // let agent = [...agentname];
    let data = ctogetresponse(representativeData, assigndata, agentname);

    // let data = [];
    // representativeData.forEach((i) => {
    //   let representativObj = {};
    //   assigndata.forEach((j) => {
    //     agentname.forEach((k) => {
    //       if (i._id.toString() === j.representative_request_id) {
    //         representativObj["_id"] = i._id;
    //         representativObj["representativerole_id"] = j._id;
    //         representativObj["company_name"] = i.companyName;
    //         representativObj["business_email"] = i.old_business_email;
    //         representativObj["request_date"] = j.request_date;
    //         representativObj["request_status"] = j.request_status;
    //         representativObj["cto_cac_docurl_status"] = j.cto_cac_docurl_status;
    //         representativObj["agent_name"] = k ? k.name : "";
    //         representativObj["cto_other_docurl_status"] =
    //           j.cto_other_docurl_status;
    //         representativObj["cto_details_status"] = j.cto_details_status;
    //         data.push(representativObj); // Push inside the loop
    //       }
    //     });
    //   });
    // });

    // console.log(data);
    // await axios.request(config).then((response) => {
    // res.setHeader("Content-Type", response.headers["content-type"]);
    let objdata = data.filter((obj) => Object.keys(obj).length > 0);
    return res.status(200).send({ status: 200, data: objdata });
    return response.data.pipe(res);

    // });
    // return res.status(200).send({ status: 200, data });
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

// const ctogetdatabyid = async (req, res) => {
//   try {
//     //   const assigndata = await managementrole.find({
//     //     $or: [
//     //       {
//     //         request_status: "ASSIGN",
//     //         helpdesk_cac_docurl_status: "APPROVED",
//     //         helpdesk_other_docurl_status: "APPROVED",
//     //       },
//     //     ],
//     //   });
//     const representativeData = await representative
//       .find(
//         {
//           _id: req.params.request_id,
//           request_status: false,
//         },
//         {
//           password: 0,
//           security_question1: 0,
//           security_answer1: 0,
//           security_question2: 0,
//           security_answer2: 0,
//           security_question3: 0,
//           security_answer3: 0,
//         }
//       )
//       .lean();
//     // let data = [];
//     // representativeData.forEach((i) => {
//     //   let representativObj = {};
//     //   representativObj = { ...i };
//     //   assigndata.map((j) => {
//     //     if (i._id === j.representative_request_id) {
//     //       return representativObj;
//     //     }
//     //   });
//     //   data.push(representativObj);
//     // });
//     // console.log(data);
//     return res.status(200).send({ status: 200, data: representativeData });
//   } catch (error) {
//     return res.status(401).send({ message: error.message });
//   }
// };

const updatedetailsrequest = async (req, res) => {
  try {
    const authtoken = req.headers.authorization;
    const token = authtoken.split(" ")[1];
    // console.log(token, "token");
    const email = jwt.decode(token);
    // console.log(email._id, "email");

    const adminUserData = await adminusers
      .findOne({ email: email._id, role: "CTO_ADMIN_USER" })
      .lean();
    // console.log(adminUserData, "adminUserData");

    const management_id = await managementrole
      .findOne({ _id: req.params.request_id })
      .lean();

    const representativeemail = await representative
      .findOne({ _id: management_id.representative_request_id })
      .lean();
    if (adminUserData) {
      if (Object.values(req.body).includes("REJECTED")) {
        const updateDate = await managementrole.updateMany(
          {
            _id: req.params.request_id,
          },
          {
            $set: req.body,
            cto_user_id: adminUserData._id,
            request_status: "REJECTED",
          }
        );

        emailservices.sendEmail(
          representativeemail.old_business_email,
          "change represetative request rejected",
          "your eel nis change representative request has been rejected"
        );
        await emailservices.sendEmail(
          representativeemail.new_business_email,
          "change represetative request rejected",
          "your change representative request has been rejecte by head office"
        );
        return res.status(200).send({ status: 200, message: "status updated" });
      } else {
        const updateDate = await managementrole.updateMany(
          {
            _id: req.params.request_id,
          },
          {
            $set: req.body,
            cto_user_id: adminUserData._id,
          }
        );
        return res.status(200).send({ status: 200, message: "status updated" });
      }
    } else {
      return res
        .status(401)
        .send({ status: 401, message: "unauthorised person" });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const exemptgetalldata = async (req, res) => {
  try {
    const data = await employee_exempt
      .find({
        request_status: "ASSIGN",
        helpdesk_exempt_document_one_status: "APPROVED",
        helpdesk_exempt_document_two_status: "APPROVED",
        helpdesdesk_request_status: "APPROVED",
      })
      .lean();
    return res.status(200).send({ status: 200, data });
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const updateexemptrequest = async (req, res) => {
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
    return res.status(401).send({ message: error.message });
  }
};

module.exports = {
  ctogetalldata,
  // ctogetdatabyid,
  updatedetailsrequest,
  exemptgetalldata,
  updateexemptrequest,
};
