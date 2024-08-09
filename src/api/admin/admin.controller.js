const employee = require("../../model/employee.model");
const company = require("../../model/company.model");
const user = require("../../model/user.model");
const companyDocs = require("../../model/user.forgetpassword.model");
const helpdeskuser = require("../../model/helpdesk_user.model");
const contactus = require("../../model/contactus.model");
const kyc = require("../../model/comapny_kyc_status.model");
const employeekyc = require("../../model/employee_kyc_status");
const dependent = require("../../model/dependant");
const card = require("../../model/card.model");
const enquiry = require("../../model/enquiry.eelms");
const adminusers = require("../../model/admin_users.model");
const managementrole = require("../../model/management_role.model");
const representative = require("../../model/change_representative.model");
const archive_employee = require("../../model/employee_archive");
const archive_card = require("../../model/card_archive.model");
const delete_employee_request = require("../../model/employee_delete_request.model");
const employee_exempt = require("../../model/employeexpempt.model");
const cardprint = require("../../model/card_printing.model");

const jwt = require("jsonwebtoken");
const secretkey = process.env.secretkey;
const emailservices = require("../../services/email.service");
const bcrypt = require("bcrypt");
const generateUniqueAlphanumeric = require("../payment/payment.service");
// function getServerDate() {
//   const serverDate = new Date(); // This assumes the server time is in the local time zone
//   const options = { day: "2-digit", month: "2-digit", year: "numeric" };
//   return serverDate.toLocaleDateString("en-GB", options);
// }
// const moment(new Date()).format("DD/MM/YYYY") = getServerDate();
// console.log(moment(new Date()).format("DD/MM/YYYY"));
const serverUI = process.env.pdf_uri;
const resetPassword = process.env.reset_password;
let eel_portal_link = process.env.eel_portal_link;
const moment = require("moment");
const { request } = require("express");
const managemnetData = require("../../model/management_role.model");
const { assign } = require("nodemailer/lib/shared");

const fetchrequest = async (req, res) => {
  try {
    const data = await employee.aggregate([
      { $match: { empstatus: { $in: ["partial active"] } } },
      {
        $lookup: {
          from: "companies",
          localField: "userid",
          foreignField: "userid",
          as: "companydata",
        },
      },
      {
        $project: {
          givenname: 1,
          surname: 1,
          businessEmail: 1,
          deletedocuments: 1,
          "companydata.comapnyName": 1,
          "companydata.business_email": 1,
        },
      },
    ]);

    // console.log(data);
    return res.status(200).send({ data, status: 200 });
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const deleteemployee = async (req, res) => {
  try {
    const Empdata = await employee
      .findOne({ _id: req.body._id, paymentstatus: "complete" }, { _id: 0 })
      .lean();
    if (req.body.status === "rejected") {
      const datadeletion = await employee.updateMany(
        { _id: req.body._id },
        {
          $set: {
            empstatus: ["Active"],
            deleterequest: true,
          },
        }
      );
      return res
        .status(200)
        .send({ message: "employee not deleted", status: 200 });
    } else if (req.body.status === "approved") {
      const datadeletion = await employee.updateMany(
        { _id: req.body._id },
        {
          $set: {
            empstatus: ["suspended"],
            deleterequest: true,
          },
        }
      );
      const fetchEmpdata = await employee.findByIdAndDelete({
        _id: req.body._id,
        paymentstatus: "complete",
      });
      const cardData = await card
        .findOne({ emp_registration_id: Empdata._id })
        .lean();
      let cardObj = {};
      cardObj = { ...cardData };
      delete cardObj._id;
      const deleteemployee = await archive_employee.create(Empdata);
      const deletecard = await archive_card.create(cardObj);
      if (deleteemployee) {
        return res
          .status(200)
          .send({ message: "employee deleted", status: 200 });
      }
    } else {
      return res.status(200).send({ message: "employee not deleted" });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const documenturl = async (req, res) => {
  try {
    const employeeData = await employee.findOne(
      { _id: req.body._id },
      { deletedocuments: 1, userid: 1 }
    );
    // console.log(employeeData);
    const photoURI = employeeData.deletedocuments.split("/")[2];
    // console.log(photoURI, "uri");
    const photo_string = serverUI.concat(
      "/",
      employeeData.userid,
      "/",
      photoURI
    );
    return res.status(200).send({ status: 200, photo_string });
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const getdeletemeployee = async (req, res) => {
  try {
    const dataemp = await employee
      .findOne(
        { _id: req.params._id },
        { givenname: 1, surname: 1, deletedocuments: 1, userid: 1 }
      )
      .lean();
    const datacompany = await company
      .findOne(
        { userid: dataemp.userid },
        { comapnyName: 1, business_email: 1 }
      )
      .lean();
    // console.log(datacompany);
    const obj = dataemp;
    dataemp["comapnyName"] = datacompany.comapnyName;
    dataemp["company_business_email"] = datacompany.business_email;
    return res.status(200).send({ obj, status: 200 });
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const changepassword = async (req, res) => {
  try {
    let email = req.body.businessEmail.toLowerCase();
    const fetchuser = await user.findOne({
      businessEmail: email,
    });
    const token = jwt.sign({ businessEmail: email }, secretkey, {
      expiresIn: "24hrs",
    });
    let subject = "change password";
    let text = `click on this link to rest password ${resetPassword}/company/reset/${token}`;
    await emailservices.sendEmail(email, subject, text);
    const update = await user.updateOne(
      {
        businessEmail: email,
      },
      {
        $set: { accessToken: token },
      }
    );
    return res
      .status(200)
      .send({ message: "check mail for link", status: 200 });
    // } else {
    // return res.status(401).send({ message: "user not found", status: 401 });
    // }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const resetpassword = async (req, res) => {
  try {
    const authtoken = req.headers.authorization;
    const token = authtoken.split(" ")[1];
    // console.log(token, "token");
    const email = jwt.decode(token);
    // console.log(jwtdata);
    const salt = await bcrypt.genSaltSync(10);
    // console.log(salt);
    const hashedPassword = await bcrypt.hashSync(req.body.password, salt);
    // console.log(hashedPassword);

    const resetdata = await user.findOne({
      businessEmail: email.businessEmail,
    });
    // console.log(resetdata, "reset");
    const updatepass = await user.updateOne(
      { businessEmail: email.businessEmail },
      {
        $set: {
          password: hashedPassword,
          loginattempt: 0,
          forgetpassword_attempt: 0,
        },
      }
    );
    // console.log(resetdata);
    return res
      .status(200)
      .send({ message: "password change succesfully", status: 200 });
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const resetforgotpassword = async (req, res) => {
  try {
    const authtoken = req.headers.authorization;
    const token = authtoken.split(" ")[1];
    // console.log(token, "token");
    const email = jwt.decode(token);
    // console.log(email);
    const salt = await bcrypt.genSaltSync(10);
    // console.log(salt, "salt");
    const hashedPassword = await bcrypt.hashSync(req.body.password, salt);
    // console.log(hashedPassword);
    // const resetdata = await user.findOne({
    //   businessEmail: email.businessEmail,
    // });
    // console.log(resetdata, "reset");
    const updatepass = await user.updateOne(
      { businessEmail: email.businessEmail },
      {
        $set: {
          securityQuestion1: req.body.securityQuestion1,
          securityAnswer1: req.body.securityAnswer1,
          securityQuestion2: req.body.securityQuestion2,
          securityAnswer2: req.body.securityAnswer2,
          securityQuestion3: req.body.securityQuestion3,
          securityAnswer3: req.body.securityAnswer3,
          password: hashedPassword,
          loginattempt: 0,
          forgetpassword_attempt: 0,
        },
      }
    );
    // console.log(resetdata);
    return res
      .status(200)
      .send({ message: "password change succesfully", status: 200 });
  } catch (error) {
    return res.status(401).send({ message: error.message, status: 401 });
  }
};

const getallpassword = async (req, res) => {
  try {
    const companydata = await user.find({
      forgetpassword_attempt: 3,
    });
    // console.log(companydata, "companydata");
    let obj = [];
    companydata.forEach(async (i) => {
      obj.push(i.businessEmail);
    });
    // console.log(obj, "obj");
    const company_name = await user.find(
      { businessEmail: { $in: obj } },
      {
        comapnyName: 1,
        businessEmail: 1,
        // _id: 1,
      }
    );
    // console.log(company_name, "compname");
    const companyobj = await companyDocs.find(
      { email: { $in: obj } },
      {
        // comapnyName: 1,
        email: 1,
        cac_doc: 1,
        tcc_doc: 1,
        expatriate_quota_position: 1,
      }
    );
    // console.log(companyobj, "obj1");
    const result = company_name
      .map((itemA) => {
        const matchingItemB = companyobj.find(
          (itemB) => itemB.email === itemA.businessEmail
        );
        if (matchingItemB) {
          return {
            _id: matchingItemB._id.toString(),
            companyName: itemA.comapnyName,
            email: itemA.businessEmail,
            cac_doc: matchingItemB.cac_doc,
            tcc_doc: matchingItemB.tcc_doc,
            expatriate_quota_position: matchingItemB.expatriate_quota_position,
            userid: itemA._id,
          };
        } else {
          return null; // Handle case when there is no match for the email
        }
      })
      .filter((item) => item !== null);
    // console.log(JSON.stringify(result, ));
    return res.status(200).send({ data: result, status: 200 });
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const getcompanydocs = async (req, res) => {
  try {
    // console.log(req.body._id);
    const getdoc = await companyDocs.findOne(
      { _id: req.body._id },
      { tcc_doc: 1, cac_doc: 1, expatriate_quota_position: 1 }
    );
    // console.log(getdoc);
    if (req.body.filetype === "cac") {
      const cacURI = getdoc.cac_doc.split("/")[2];
      // console.log(photoURI, "uri");
      const cac = serverUI.concat("/", req.body.userid, "/", cacURI);

      return res.status(200).send({ cac, status: 200 });
    } else if (req.body.filetype === "tcc") {
      const tccURI = getdoc.tcc_doc.split("/")[2];
      // console.log(photoURI, "uri");
      const tcc = serverUI.concat("/", req.body.userid, "/", tccURI);

      return res.status(200).send({ tcc, status: 200 });
    } else if (req.body.filetype === "expatriate_quota_position") {
      const expatriate_quota_positionURI =
        getdoc.expatriate_quota_position.split("/")[2];
      // console.log(photoURI, "uri");
      const expatriate_quota_position = serverUI.concat(
        "/",
        req.body.userid,
        "/",
        expatriate_quota_positionURI
      );
      return res.status(200).send({ expatriate_quota_position, status: 200 });
    }

    // console.log(getdoc);
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const companyforgotpassword = async (req, res) => {
  try {
    // console.log(req.params._id);
    const companyDoc = await user
      .findOne({ _id: req.params._id }, { businessEmail: 1, comapnyName: 1 })
      .lean();
    // console.log(companyDoc, "companydoc");
    const companyobj = await companyDocs
      .findOne(
        { email: companyDoc.businessEmail },
        {
          // comapnyName: 1,
          email: 1,
          cac_doc: 1,
          tcc_doc: 1,
          expatriate_quota_position: 1,
        }
      )
      .lean();
    // companyobj["companyName"] = companyDoc.comapnyName;
    let obj = {};
    obj = { ...companyobj };
    obj["comapnyName"] = companyDoc.comapnyName;
    // console.log(obj);
    return res.status(200).send({ companyobj: obj, status: 200 });
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const changestate = async (req, res) => {
  try {
    let email = req.body.businessEmail.toLowerCase();

    const passwordData = await user.findOne({
      businessEmail: email,
      forgetpassword_attempt: 3,
      // loginattempt: 3,
    });
    if (req.body.status === "approved") {
      console.log("in");
      const changestate = await user.updateOne(
        { businessEmail: email },
        {
          $set: {
            // forgetpassword_attempt: 0,
            // password: hashedPassword,
            admin_action_status: "approved",
          },
        }
      );
      const token = jwt.sign({ businessEmail: email }, secretkey);
      let subject = "change password";
      let text = `click on this link to rest password /${token}`;
      await emailservices.sendEmail(email, subject, text);
      return res
        .status(200)
        .send({ message: "the password has been send to mail", status: 200 });
    } else if (req.body.status === "rejected") {
      const changestate = await user.updateOne(
        { _id: passwordData._id },
        { $set: { admin_action_status: "rejected" } }
      );
      let subject = "you request has been rejected";
      let text = `Dear ${passwordData.comapnyName}  your request for seeting the approval has been reject by admin. kindly connect to service center `;
      const data = await emailservices.sendEmail(
        passwordData.businessEmail,
        subject,
        text
      );
      return res
        .status(200)
        .send({ message: "the users approval rejected by admin", status: 200 });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const getallcompanydocs = async (req, res) => {
  try {
    const comanyData = await company.findOne(
      { _id: req.params._id },
      {
        cac: 1,
        tcc: 1,
        additional_document: 1,
        itf: 1,
        pancom: 1,
      }
    );
    // console.log(comanyData);
    if (comanyData) {
      return res.status(200).send({ status: 200, data: comanyData });
    } else {
      return res
        .status(404)
        .send({ status: 404, message: "comapny not found" });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const getallcomapnydata = async (req, res) => {
  // console.log("req");
  try {
    //assign kyc agent id only
    const kycData = await kyc.find({
      $or: [
        { company_email: req.params.company_email, request_status: "APPROVED" },
        { companyname: req.params.comapnyname, request_status: "APPROVED" },
        { request_status: "APPROVED" },
      ],
    });
    let kycuserid = kycData.map((i) => {
      return i.userid;
    });

    // console.log(kycuserid, "kycus");

    let agentid = kycData.map((i) => {
      return i.agent_id;
    });

    const helpdaeskName = await helpdeskuser
      .find({ _id: { $in: agentid } })
      .lean();
    // console.log(helpdaeskName, "helpdesk");
    let pushData = [];
    const comanyData = await company
      .find(
        { userid: { $in: kycuserid }, kyc_status: "APPROVED" },
        {
          comapnyName: 1,
          phone_number: 1,
          business_email: 1,
          kyc_status: 1,
          userid: 1,
        }
      )
      .lean();
    // console.log(comanyData);
    pushData = [...comanyData];
    const mapping = {};
    // console.log(, "dataArray");
    let data = {};
    let datamapped = [];
    kycData.forEach((item) => {
      if (item.agent_id) {
        // console.log(item.agent_id);
        // Finding the corresponding helpdeskName object with the matching _id
        const agentDatamapped = helpdaeskName.find((agent) => {
          // console.log(agent._id, "agentid");
          return agent._id.toString() === item.agent_id;
        });

        // console.log("agentData");

        // If a matching helpdeskName object is found, create the mapping
        if (agentDatamapped) {
          // console.log("in1");
          mapping["_userid"] = item.userid;
          mapping["name"] = agentDatamapped.name;
        }
      }
      // console.log(agentDatamapped, "aagentData");
      pushData.forEach((i) => {
        // mapping.map((j) => {
        if (i.userid === mapping._userid) {
          data = { ...i, ...mapping };
          datamapped.push(data);
        }
        // });
      });
    });
    // console.log(data);
    if (comanyData) {
      return res.status(200).send({ status: 200, data: datamapped });
    } else {
      return res
        .status(404)
        .send({ status: 404, message: "comapny not found" });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const companykycbyid = async (req, res) => {
  try {
    // console.log(req.params._id);
    const data = await kyc.findOne({ _id: req.params._id }).lean();
    console.log(data, "data");
    if (data.agent_id) {
      const agentname = await helpdeskuser
        .findOne({ _id: data.agent_id })
        .lean();
      console.log(agentname, "agentname");

      let agentData = {};
      agentData = data;
      agentData["agent_name"] = agentname ? agentname.name : "";
      return res.status(200).send({ status: 200, data: agentData });
    } else {
      return res.status(200).send({ status: 203, data });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const getallusersdata = async (req, res) => {
  try {
    const usersData = await helpdeskuser
      .find(
        {},
        {
          name: 1,
          email: 1,
          phone_no: 1,
          is_active: 1,
          dob: 1,
          gender: 1,
          roles: 1,
        }
      )
      .lean();
    if (usersData) {
      return res.status(200).send({ status: 200, data: usersData });
    } else {
      return res
        .status(404)
        .send({ status: 404, message: "comapny not found" });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const getuserdetails = async (req, res) => {
  try {
    const usersData = await helpdeskuser
      .findOne(
        { _id: req.params._id },
        {
          name: 1,
          email: 1,
          phone_no: 1,
          is_active: 1,
          dob: 1,
          gender: 1,
          roles: 1,
        }
      )
      .lean();
    if (usersData) {
      return res.status(200).send({ status: 200, data: usersData });
    } else {
      return res.status(404).send({ status: 404, message: "user not found" });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const getcomapnydetails = async (req, res) => {
  try {
    const comanyData = await company.findOne(
      { _id: req.params._id },
      { createdAt: 0 }
    );
    // console.log(comanyData);
    if (comanyData) {
      return res.status(200).send({ status: 200, data: comanyData });
    } else {
      return res
        .status(404)
        .send({ status: 404, message: "comapny not found" });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const updatekycstatus = async (req, res) => {
  try {
    // console.log("req");
    if (req.body.kyc_status === "approved") {
      const updatedetails = await company.updateOne(
        { _id: req.body._id },
        {
          $set: {
            kyc_status: "APPROVED",
          },
        }
      );
      return res
        .status(200)
        .send({ status: 200, message: "kyc status updated" });
    } else if (req.body.kyc_status === "rejected") {
      const updatedetails = await company.updateOne(
        { _id: req.body._id },
        {
          $set: {
            kyc_status: "REJECTED",
          },
        }
      );
      return res
        .status(200)
        .send({ status: 200, message: "kyc status updated" });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const getemployeedata = async (req, res) => {
  try {
    // console.log("req");
    const employeeData = await employee.aggregate([
      {
        $lookup: {
          from: "companies",
          localField: "userid",
          foreignField: "userid",
          as: "company_role",
        },
      },
      {
        $unwind: "$company_role",
      },
      {
        $project: {
          comapnyName: "$company_role.comapnyName",
          companyId: "$company_role._id",
          givenname: 1,
          surname: 1,
          empemail: 1,
          empnumber: 1,
          userid: 1,
          passportnumber: 1,
          uploadpassport: 1,
          visanumber: 1,
          cerpac_number: 1,
          cerpac_front: 1,
          cerpac_back: 1,
          kyc_status: 1,
        },
      },
    ]);
    // console.log(employeeData);
    if (employeeData.length) {
      return res.status(200).send({ status: 200, data: employeeData });
    } else {
      return res
        .status(404)
        .send({ status: 404, message: "comapny not found" });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const employeekycbyid = async (req, res) => {
  try {
    // console.log(req.params._id);
    const data = await employeekyc.findOne({ _id: req.params._id });
    if (Object.keys(data).indexOf("agent_id") !== -1) {
      // console.log(Object.keys(data).indexOf("agent_id"));
      const agentname = await helpdeskuser
        .findOne({ _id: data.agent_id })
        .lean();
      let agentData = {};
      agentData = data;
      agentData["agent_name"] = agentname.name;
      return res.status(200).send({ status: 200, data: agentData });
    } else {
      return res.status(200).send({ status: 200, data });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const getemplayeedetails = async (req, res) => {
  // console.log("req");
  try {
    const emoloyeedetails = await employee
      .findOne({ _id: req.params._id }, { createdAt: 0 })
      .lean();
    // console.log(emoloyeedetails);
    if (emoloyeedetails) {
      return res.status(200).send({ status: 200, data: emoloyeedetails });
    } else {
      return res
        .status(404)
        .send({ status: 404, message: "comapny not found" });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const empkycstatusupdate = async (req, res) => {
  try {
    if (req.body.kyc_status === "approved") {
      const updatedetails = await employee.updateOne(
        { _id: req.body._id },
        {
          $set: {
            kyc_status: "APPROVED",
          },
        }
      );
      return res
        .status(200)
        .send({ status: 200, message: "kyc status updated" });
    } else if (req.body.kyc_status === "rejected") {
      const updatedetails = await employee.updateOne(
        { _id: req.body._id },
        {
          $set: {
            kyc_status: "REJECTED",
          },
        }
      );
      return res
        .status(200)
        .send({ status: 200, message: "kyc status updated" });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const admindashboard = async (req, res) => {
  try {
    const helpdeskData = await contactus.find({
      request_date: req.query.date,
      agent_id: { $exists: false },
      request_status: false,
    });
    const kycData = await kyc.find({
      request_date: req.query.date,
      agent_id: { $exists: false },
      request_status: "PENDING",
    });
    const companyDocData = await companyDocs.find({
      request_date: req.query.date,
      agent_id: { $exists: false },
      request_status: false,
    });
    const employeekycdata = await employeekyc.find({
      request_date: req.query.date,
      agent_id: { $exists: false },
      request_status: "PENDING",
    });
    const helpdeskassignData = await contactus.find({
      request_date: req.query.date,
      agent_id: { $exists: true },
      request_status: false,
    });
    const kycassignData = await kyc.find({
      request_date: req.query.date,
      agent_id: { $exists: true },
      request_status: "PENDING",
    });
    const companyDocassignData = await companyDocs.find({
      request_date: req.query.date,
      agent_id: { $exists: true },
      request_status: false,
    });
    const employeekycassigndata = await employeekyc.find({
      request_date: req.query.date,
      agent_id: { $exists: true },
      request_status: "PENDING",
    });

    const changerepresentativeassigndata = await representative.find({
      request_date: req.query.date,
      agent_id: { $exists: true },
      request_status: false,
    });

    const helpdeskdata = await helpdeskuser.find({});
    const total_pending_requests =
      helpdeskData.length +
      kycData.length +
      companyDocData.length +
      employeekycdata.length;
    const total_assign_request =
      helpdeskassignData.length +
      kycassignData.length +
      employeekycassigndata.length +
      companyDocassignData.length;

    const total_request_count = total_pending_requests + total_assign_request;
    let data = {
      total_request_count,
      total_pending_requests,
      total_assign_request,
      total_company_kyc_requests_count: kycData.length,
      total_employee_kyc_requests: employeekycdata.length,
      total_helpdesk_request: helpdeskData.length,
      total_forgetpassword_request: companyDocData.length,
      total_users_count: helpdeskData.length,
    };
    return res.status(200).send({ status: 200, data });
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const createhelpdesk = async (req, res) => {
  try {
    let emailpassword = generateUniqueAlphanumeric();
    req.body.emailpassword = emailpassword;
    const dataExist = await helpdeskuser.findOne({ email: req.body.email });
    if (dataExist) {
      return res.status(200).send({ status: 200, message: "the user exists" });
    } else {
      const data = await helpdeskuser.create(req.body);
      // console.log(data);
      let Subject = "EEL HELP-DESK USER CONFIRMATION";

      let text = `
Dear ${req.body.name},\n
Your user has been created successfully with EELMS help-desk portal.\n
Find below mentioned login credentials:\n
Username: ${req.body.email}\n
Password: ${emailpassword}\n
To login click on below link:\n
${eel_portal_link}
This is an automated message, please do not reply. If you need additional assistance, kindly contact to your admin.\n
 
Thank you, 
EEL Team `;

      await emailservices.sendEmail(req.body.email, Subject, text);
      return res
        .status(201)
        .send({ status: 201, message: "the user is created" });
    }
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const helpdeskresetpass = async (req, res) => {
  try {
    const userexist = await helpdeskuser.findOne({ email: req.body.email });
    // console.log(userexist);
    if (userexist) {
      // // console.log("in");
      const salt = await bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hash(req.body.newpassword, salt);
      if (userexist.emailpassword === req.body.oldpassword) {
        // console.log("in1");
        const updatePass = await helpdeskuser.updateOne(
          {
            email: req.body.email,
          },
          {
            $set: { password: hashedPassword },
          }
        );
        return res
          .status(200)
          .send({ message: "password changed successfully", status: 200 });
      } else {
        return res
          .status(401)
          .send({ message: "incorrect password ", status: 401 });
      }
    } else {
      // console.log("f");
      return res.status(404).send({ message: "user not exist", status: 404 });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message, status: 401 });
  }
};

const helpdesklogin = async (req, res) => {
  try {
    const hdData = await helpdeskuser
      .findOne({
        email: req.body.email,
      })
      .lean();
    if (!hdData) {
      return res.status(404).send({
        message: "employee not found",
        // _id: hdData.emp_registration_id,
        status: 404,
      });
    }
    let token = jwt.sign({ _id: hdData.email }, secretkey, {
      expiresIn: "24h",
    });
    // console.log(hdData);
    if (
      hdData.emailpassword === req.body.password &&
      Object.keys(req.body).indexOf("password") !== -1
    ) {
      // console.log("in");
      return res.status(203).send({
        message: "change the password",
        _id: hdData.emp_registration_id,
        status: 203,
      });
    } else if (req.body.password !== "") {
      // console.log("out");
      // console.log(picture);
      let decryptpasssword = await bcrypt.compare(
        req.body.password,
        hdData.password,
        (err, data) => {
          if (!data) {
            // console.log(err, "err");
            return res.status(400).send({
              message: "incorrect password",
              status: 400,
            });
          } else {
            let hdobj = {};
            hdobj = hdData;
            delete hdData.emailpassword;
            delete hdData.password;
            let data = hdobj;
            return res.status(200).send({
              message: "user login succesfully",
              token,
              data,
              status: 200,
            });
          }
        }
      );
      // console.log("decryptpasssword");
    } else {
      return res.status(401).send({
        message: "please enter password",
        status: 401,
      });
    }
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};
const getuserbytoken = async (req, res) => {
  try {
    // console.log(req.headers);
    const authtoken = req.headers.authorization;
    const token = authtoken.split(" ")[1];
    // console.log(token, "token");
    const email = jwt.decode(token);
    // console.log(email, "email");
    const data = await helpdeskuser
      .findOne(
        { email: email._id },
        { password: 0, emailpassword: 0, createdAt: 0 }
      )
      .lean();
    let accessToken = jwt.sign({ email: data.email }, secretkey, {
      expiresIn: "24h",
    });
    // console.log(accessToken);
    let obj = { ...data };
    obj["accessToken"] = accessToken;
    // console.log(obj);
    return res.status(200).send({ data: obj, status: 200 });
  } catch (error) {
    return res.status(401).send({ message: error.message, status: 401 });
  }
};

const updateuser = async (req, res) => {
  try {
    const updateUser = await helpdeskuser.updateOne(
      { _id: req.body._id },
      {
        $set: req.body,
      }
    );
    return res.status(200).send({ status: 200, message: "user updated" });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const reportalldata = async (req, res) => {
  try {
    // console.log(req.params);
    const usersData = await contactus
      .find(
        {
          $or: [
            { user_email: req.params.user_email, request_status: false },
            { fullname: req.params.fullname, request_status: false },
            { request_status: false },
          ],
        },
        {
          fullname: 1,
          user_email: 1,
          userid: 1,
          message: 1,
          agent_id: 1,
          request_date: 1,
          request_status: 1,
        }
      )
      .lean();
    // console.log(usersData);
    // let mapData = usersData.map((i) => {
    //   if (Object.keys(i) === "agent_id") {
    //     console.log(i);
    //     return i;
    //   }
    //   return i;
    // });
    let agentIds = usersData.map((item) => item.agent_id).filter(Boolean);
    // console.log(agentIds, "agentIds");
    const agent_name = await helpdeskuser.find({ _id: { $in: agentIds } });
    let namedData = usersData.map((i) => {
      if (Object.keys(i).indexOf("agent_id") !== -1) {
        agent_name.forEach((j) => {
          if (i.agent_id === j._id.toString()) {
            i["agentName"] = j.name;
          }
          // return i;
        });
        // console.log(i, "i");
        return i;
      }
      return i;
    });
    if (usersData.length) {
      return res.status(200).send({ status: 200, data: namedData });
    } else {
      return res.status(200).send({ status: 200, data: usersData });
    }
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const kycdata = async (req, res) => {
  try {
    // console.log("req.params");
    const usersData = await kyc
      .find(
        {
          $or: [
            {
              company_email: req.params.company_email,
              request_status: "PENDING",
            },
            {
              companyname: req.params.companyname,
              request_status: "PENDING",
            },
            { request_status: "PENDING" },
          ],
        },
        { cac: 0, tcc: 0, itf: 0, pancom: 0 }
      )
      .lean();
    // console.log(usersData);

    let agentIds = usersData.map((item) => item.agent_id).filter(Boolean);
    // console.log(agentIds, "agentIds");
    const agent_name = await helpdeskuser.find({ _id: { $in: agentIds } });
    let namedData = usersData.map((i) => {
      if (Object.keys(i).indexOf("agent_id") !== -1) {
        agent_name.forEach((j) => {
          if (i.agent_id === j._id.toString()) {
            i["agentName"] = j.name;
          }
          // return i;
        });
        // console.log(i, "i");
        return i;
      }
      return i;
    });
    // console.log(namedData, "i");

    // aggregation
    // const usersData = await kyc.aggregate([
    //   {
    //     $match: {
    //       $or: [
    //         { company_email: req.params.company_email, request_status: false },
    //         { companyname: req.params.companyname, request_status: false },
    //         { request_status: false },
    //       ],
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "hpledeskusers",
    //       localField: "agent_id",
    //       foreignField: "_id",
    //       as: "helpdeskdata",
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$helpdeskdata",
    //       preserveNullAndEmptyArrays: true,
    //     },
    //   },
    //   {
    //     $project: {
    //       agent_name: "$name",
    //       companyname: 1,
    //       company_email: 1,
    //       userid: 1,
    //       request_status: 1,
    //       request_date: 1,
    //       cacdocument: 1,
    //       tccdocument: 1,
    //       itfdocument: 1,
    //       pancomdocument: 1,
    //       agent_id: 1,
    //       allocation_date: 1,
    //       remark: 1,
    //     },
    //   },
    //   // { cac: 0, tcc: 0, itf: 0, pancom: 0 },
    // ]);

    // let mapData = usersData.map((i) => {
    //   if (Object.keys(i) === "agent_id") {
    //     console.log(i, "i1");

    //     return i;
    //   }
    //   console.log(i, "i2");

    //   return i;
    // });
    // console.log(usersData, "mapData");
    if (usersData.length) {
      return res.status(200).send({ status: 200, data: namedData });
    } else {
      return res.status(200).send({ status: 200, data: usersData });
    }
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const employeekycdata = async (req, res) => {
  // console.log("req.url");
  try {
    const usersData = await employeekyc
      .find(
        {
          $or: [
            { email: req.query.email, request_status: "PENDING" },
            { request_status: "PENDING" },
          ],
        },
        { cerpac_back: 0, cerpac_front: 0, uploadpassport: 0, createdAt: 0 }
      )
      .lean();
    let agentIds = usersData.map((item) => item.agent_id).filter(Boolean);
    // console.log(agentIds, "agentIds");
    const agent_name = await helpdeskuser.find({ _id: { $in: agentIds } });
    let namedData = usersData.map((i) => {
      if (Object.keys(i).indexOf("agent_id") !== -1) {
        agent_name.forEach((j) => {
          if (i.agent_id === j._id.toString()) {
            i["agentName"] = j.name;
          }
          // return i;
        });
        // console.log(i, "i");
        return i;
      }
      return i;
    });

    // const assignData = await employeekyc
    //   .find(
    //     { agent_id: { $exists: true } },
    //     { cerpac_back: 0, cerpac_front: 0, uploadpassport: 0 }
    //   )
    // .lean();
    // let mapData = usersData.map((i) => {
    //   if (Object.keys(i) === "agent_id") {
    //     console.log(i);
    //     return i;
    //   }
    //   return i;
    // });
    // console.log(usersData);
    if (usersData.length) {
      return res.status(200).send({ status: 200, data: namedData });
    } else {
      return res.status(200).send({ status: 200, data: usersData });
    }
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const forgetpassworddata = async (req, res) => {
  try {
    // console.log(req.params);
    const usersData = await companyDocs
      .find(
        {
          $or: [
            { email: req.params.email, request_status: false },
            { request_status: false },
          ],
        },
        {
          cac_doc: 0,
          tcc_doc: 0,
          additional_doc: 0,
          expatriate_quota_position: 0,
        }
      )
      .lean();
    let agentIds = usersData.map((item) => item.agent_id).filter(Boolean);
    // console.log(agentIds, "agentIds");
    const agent_name = await helpdeskuser.find({ _id: { $in: agentIds } });
    let namedData = usersData.map((i) => {
      if (Object.keys(i).indexOf("agent_id") !== -1) {
        agent_name.forEach((j) => {
          if (i.agent_id === j._id.toString()) {
            i["agentName"] = j.name;
          }
          // return i;
        });
        // console.log(i, "i");
        return i;
      }
      return i;
    });

    // const assignData = await companyDocs
    //   .find(
    //     { agent_id: { $exists: true } },
    //     {
    //       cac_doc: 0,
    //       tcc_doc: 0,
    //       additional_doc: 0,
    //       expatriate_quota_position: 0,
    //     }
    //   )
    //   .lean();
    // let mapData = usersData.map((i) => {
    //   if (Object.keys(i) === "agent_id") {
    //     console.log(i);
    //     return i;
    //   }
    //   return i;
    // });
    if (usersData.length) {
      return res.status(200).send({ status: 200, data: namedData });
    } else {
      return res.status(200).send({ status: 200, data: usersData });
    }
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const enquirydata = async (req, res) => {
  try {
    // console.log("req.params");
    const usersData = await enquiry
      .find({
        $or: [
          {
            user_email: req.params.user_email,
            request_status: false,
          },
          { request_status: false },
        ],
      })
      .lean();
    // console.log(usersData);

    let agentIds = usersData.map((item) => item.agent_id).filter(Boolean);
    // console.log(agentIds, "agentIds");
    const agent_name = await helpdeskuser.find({ _id: { $in: agentIds } });
    let namedData = usersData.map((i) => {
      if (Object.keys(i).indexOf("agent_id") !== -1) {
        agent_name.forEach((j) => {
          if (i.agent_id === j._id.toString()) {
            i["agentName"] = j.name;
          }
          // return i;
        });
        // console.log(i, "i");
        return i;
      }
      return i;
    });
    // console.log(namedData, "i");

    // aggregation
    // const usersData = await kyc.aggregate([
    //   {
    //     $match: {
    //       $or: [
    //         { company_email: req.params.company_email, request_status: false },
    //         { companyname: req.params.companyname, request_status: false },
    //         { request_status: false },
    //       ],
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "hpledeskusers",
    //       localField: "agent_id",
    //       foreignField: "_id",
    //       as: "helpdeskdata",
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$helpdeskdata",
    //       preserveNullAndEmptyArrays: true,
    //     },
    //   },
    //   {
    //     $project: {
    //       agent_name: "$name",
    //       companyname: 1,
    //       company_email: 1,
    //       userid: 1,
    //       request_status: 1,
    //       request_date: 1,
    //       cacdocument: 1,
    //       tccdocument: 1,
    //       itfdocument: 1,
    //       pancomdocument: 1,
    //       agent_id: 1,
    //       allocation_date: 1,
    //       remark: 1,
    //     },
    //   },
    //   // { cac: 0, tcc: 0, itf: 0, pancom: 0 },
    // ]);

    // let mapData = usersData.map((i) => {
    //   if (Object.keys(i) === "agent_id") {
    //     console.log(i, "i1");

    //     return i;
    //   }
    //   console.log(i, "i2");

    //   return i;
    // });
    // console.log(usersData, "mapData");
    if (usersData.length) {
      return res.status(200).send({ status: 200, data: namedData });
    } else {
      return res.status(200).send({ status: 200, data: usersData });
    }
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const enquirybyid = async (req, res) => {
  try {
    // console.log(req.params._id);
    const data = await enquiry.findOne({ _id: req.params._id }).lean();
    // console.log(Object.keys(data).indexOf("agent_id"));
    if (Object.keys(data).indexOf("agent_id") !== -1) {
      // console.log(Object.keys(data).indexOf("agent_id"));
      const agentname = await helpdeskuser
        .findOne({ _id: data.agent_id })
        .lean();
      let agentData = {};
      agentData = data;
      agentData["agent_name"] = agentname.name;
      return res.status(200).send({ status: 200, data: agentData });
    } else {
      return res.status(200).send({ status: 200, data });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const assignkyc = async (req, res) => {
  try {
    let companykycdata = await kyc
      .find({ _id: { $in: req.body.request_ids } })
      .lean();
    // console.log(companykycdata);
    const resultObj = {};
    const result = companykycdata.map((item) => {
      if (item.cac) {
        resultObj.cacdocument = "PENDING";
        (resultObj["agent_id"] = req.body._id),
          (resultObj["allocation_date"] = moment(new Date()).format(
            "DD/MM/YYYY"
          ));
      }
      if (item.tcc) {
        resultObj.tccdocument = "PENDING";
        (resultObj["agent_id"] = req.body._id),
          (resultObj["allocation_date"] = moment(new Date()).format(
            "DD/MM/YYYY"
          ));
      }
      if (item.itf) {
        resultObj.itfdocument = "PENDING";
        (resultObj["agent_id"] = req.body._id),
          (resultObj["allocation_date"] = moment(new Date()).format(
            "DD/MM/YYYY"
          ));
      }
      if (item.pancom) {
        resultObj.pancomdocument = "PENDING";
        (resultObj["agent_id"] = req.body._id),
          (resultObj["allocation_date"] = moment(new Date()).format(
            "DD/MM/YYYY"
          ));
      }
      return resultObj;
    });
    // console.log(resultObj, "update_empkyc_obj");

    const data = await kyc.updateMany(
      {
        _id: { $in: req.body.request_ids },
      },
      {
        $set: resultObj,
      }
    );
    return res
      .status(200)
      .send({ status: 200, message: "kyc assign successfully" });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const deleterequestemployee = async (req, res) => {
  try {
    const deletedData = await delete_employee_request
      .find({
        $or: [{ request_status: "PENDING" }, { request_status: "ASSIGN" }],
      })
      .lean();
    let employeeIds = deletedData.map((i) => i.employee_id);
    let agentIds = deletedData.map((i) => i.agent_id);
    // console.log(deletedData, "deletedData");
    const empdata = await employee.find(
      { _id: { $in: employeeIds } },
      {
        surname: 1,
        givenname: 1,
        mereg_no: 1,
        type_of_employee: 1,
        designation: 1,
        country_of_origin: 1,
        nationality: 1,
        dob: 1,
        sex: 1,
        is_married: 1,
        passport_number: 1,
        passport_expiry: 1,
        upload_passport: 1,
        cerpac_number: 1,
        cerpac_front: 1,
        cerpac_back: 1,
        visa_type: 1,
        visa_number: 1,
        visa_document: 1,
        visa_expiry_date: 1,
        emp_number: 1,
        emp_code: 1,
        empemail: 1,
        emp_adress1: 1,
        emp_address2: 1,
        country: 1,
        state: 1,
        city: 1,
        zipcode: 1,
        employee_profile_photo: 1,
        position: 1,
        quota_expiry: 1,
        _id: 1,
      }
    );
    // if (deletedData.agent_id) {
    // console.log(deletedData.length, "in");
    // console.log(empdata.length, "in");
    // console.log(empdata, "in");

    // let agnetIds = deletedData.map((i) => i._id.toString());
    const agentName = await helpdeskuser
      .find({ _id: { $in: agentIds } })
      .lean();
    // console.log(agentName, "agen");
    // console.log(agnetIds, "agentids");

    // let objData = [];
    // agentNameArray = [...agentName];
    // data.forEach((ele) => {
    //   let requestObj = {};
    //   agentname.map((j) => {
    //     requestObj = { ...ele };
    //     requestObj["agent_name"] = j.name;
    //     return requestObj;
    //   });
    //   objData.push(requestObj);
    // });

    // let deletedArray = [];
    // deletedArray = [...deletedData];
    // let empArray = [];
    // empArray = [...empdata];

    let finalObj = deletedData.map((dataId) => {
      let employeeData = empdata.find((employedata) => {
        return employedata._id.toString() === dataId.employee_id;
      });
      // console.log(deletedData, "deleted");
      let agentname = "";
      // if (dataId && dataId.agent_id) {
      let matchingAgent = agentName.find((agent) => {
        // console.log(agent, "dataId.agent_id");
        return agent._id.toString() === dataId.agent_id;
      });
      // console.log(matchingAgent, "matchingAgent");
      if (matchingAgent) agentname = matchingAgent.name;
      // }
      if (employeeData) {
        return {
          id: dataId._id.toString(),
          company_name: dataId.company_name,
          company_email: dataId.company_email,
          surname: employeeData.surname,
          givenname: employeeData.givenname,
          employee_id: dataId.employee_id,
          employee_email: employeeData.empemail,
          request_date: dataId.request_date,
          request_status: dataId.request_status,
          agent_name: agentname,
        };
      }
    });
    let result = {
      status: 200,
      data: finalObj,
    };
    // console.log(finalObj.length);
    return res.status(200).send(result);
    // }
    // else {
    //   return res
    //     .status(200)
    //     .send({ status: 200, message: "helpdesk not assign" });
    // }
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const deleterequestemployeebyid = async (req, res) => {
  try {
    const data = await delete_employee_request
      .findOne({
        $or: [
          {
            _id: req.params.request_id,
            request_status: "PENDING",
          },
          {
            _id: req.params.request_id,
            request_status: "ASSIGN",
          },
          {
            _id: req.params.request_id,
            request_status: "REJECTED",
          },
        ],
      })
      .lean();
    // console.log(data, "data");
    const empdata = await employee
      .findOne(
        { _id: data.employee_id },
        {
          surname: 1,
          givenname: 1,
          mereg_no: 1,
          type_of_employee: 1,
          designation: 1,
          country_of_origin: 1,
          nationality: 1,
          dob: 1,
          sex: 1,
          is_married: 1,
          passportnumber: 1,
          passportexpiry: 1,
          upload_passport: 1,
          cerpac_number: 1,
          cerpac_front: 1,
          cerpac_back: 1,
          visa_type: 1,
          visa_number: 1,
          visa_document: 1,
          visa_expiry_date: 1,
          emp_number: 1,
          emp_code: 1,
          emp_email: 1,
          emp_adress1: 1,
          emp_address2: 1,
          country: 1,
          state: 1,
          city: 1,
          zipcode: 1,
          employee_profile_photo: 1,
          position: 1,
          quota_expiry: 1,
        }
      )
      .lean();
    // console.log(empdata, "empdata");
    // if (data.agent_id) {
    const agentname = await helpdeskuser.findOne({ _id: data.agent_id }).lean();
    let obj = {};

    obj = { ...data, ...empdata };
    obj["_id"] = data._id;
    obj["agent_name"] = agentname ? agentname.name : "";
    obj["employee_id"] = data.employee_id;
    // console.log(obj, ".obj");
    return res.status(200).send({ status: 200, data: obj });
    // } else {
    //   return res.status(200).send({ status: 200, data });
    // }
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const assignemployeekyc = async (req, res) => {
  try {
    let employeekycdata = await employeekyc
      .find({ _id: { $in: req.body.request_ids } })
      .lean();
    // console.log(employeekycdata);
    const resultObj = {};
    const result = employeekycdata.map((item) => {
      if (item.cerpac_front) {
        resultObj.cerpac_front_status = "PENDING";
        (resultObj["agent_id"] = req.body._id),
          (resultObj["allocation_date"] = moment(new Date()).format(
            "DD/MM/YYYY"
          ));
      }
      if (item.cerpac_back) {
        resultObj.cerpac_back_status = "PENDING";
        (resultObj["agent_id"] = req.body._id),
          (resultObj["allocation_date"] = moment(new Date()).format(
            "DD/MM/YYYY"
          ));
      }
      if (item.visa_document) {
        resultObj.visa_document_status = "PENDING";
        (resultObj["agent_id"] = req.body._id),
          (resultObj["allocation_date"] = moment(new Date()).format(
            "DD/MM/YYYY"
          ));
      }
      if (item.uploadpassport) {
        resultObj.uploadpassport_status = "PENDING";
        (resultObj["agent_id"] = req.body._id),
          (resultObj["allocation_date"] = moment(new Date()).format(
            "DD/MM/YYYY"
          ));
      }
      return resultObj;
    });
    // console.log(resultObj, "update_empkyc_obj");
    const data = await employeekyc.updateMany(
      {
        _id: { $in: req.body.request_ids },
      },
      {
        $set: resultObj,
      }
    );
    return res
      .status(200)
      .send({ status: 200, message: "kyc assign successfully" });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const assignreports = async (req, res) => {
  try {
    const data = await contactus.updateMany(
      {
        _id: { $in: req.body.request_ids },
      },
      {
        $set: {
          agent_id: req.body._id,
          allocation_date: moment(new Date()).format("DD/MM/YYYY"),
        },
      }
    );
    return res
      .status(200)
      .send({ status: 200, message: "kyc assign successfully" });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const assigncompanydocs = async (req, res) => {
  try {
    const data = await companyDocs.updateMany(
      {
        _id: { $in: req.body.request_ids },
      },
      {
        $set: {
          agent_id: req.body._id,
          allocation_date: moment(new Date()).format("DD/MM/YYYY"),
        },
      }
    );
    return res
      .status(200)
      .send({ status: 200, message: "kyc assign successfully" });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const assignenquiry = async (req, res) => {
  try {
    let companykycdata = await enquiry
      .find({ _id: { $in: req.body.request_ids } })
      .lean();
    // console.log(companykycdata);
    const resultObj = {};
    // const result = companykycdata.map((item) => {
    //   if (item.cac) {
    //     resultObj.cacdocument = "inactive";
    //     (resultObj["agent_id"] = req.body._id),
    //       (resultObj["allocation_date"] = moment(new Date()).format("DD/MM/YYYY"));
    //   }
    //   if (item.tcc) {
    //     resultObj.tccdocument = "inactive";
    //     (resultObj["agent_id"] = req.body._id),
    //       (resultObj["allocation_date"] = moment(new Date()).format("DD/MM/YYYY"));
    //   }
    //   if (item.itf) {
    //     resultObj.itfdocument = "inactive";
    //     (resultObj["agent_id"] = req.body._id),
    //       (resultObj["allocation_date"] = moment(new Date()).format("DD/MM/YYYY"));
    //   }
    //   if (item.pancom) {
    //     resultObj.pancomdocument = "inactive";
    //     (resultObj["agent_id"] = req.body._id),
    //       (resultObj["allocation_date"] = moment(new Date()).format("DD/MM/YYYY"));
    //   }
    //   return resultObj;
    // });
    // console.log(moment(new Date()).format("DD/MM/YYYY"), "moment(new Date()).format("DD/MM/YYYY")");

    const data = await enquiry.updateMany(
      {
        _id: { $in: req.body.request_ids },
      },
      {
        $set: {
          agent_id: req.body._id,
          allocation_date: moment(new Date()).format("DD/MM/YYYY"),
        },
      }
    );
    return res
      .status(200)
      .send({ status: 200, message: "enquiry assign successfully" });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const assigndeleteemployeerequest = async (req, res) => {
  try {
    const data = await delete_employee_request.updateMany(
      {
        _id: { $in: req.body.request_ids },
      },
      {
        $set: {
          agent_id: req.body._id,
          request_status: "ASSIGN",
          allocation_date: moment(new Date()).format("DD/MM/YYYY"),
        },
      }
    );
    return res
      .status(200)
      .send({ status: 200, message: "enquiry assign successfully" });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const serachcompanydetails = async (req, res) => {
  try {
    console.log(req.query, "decode");
    if (Object.keys(req.query).includes("companyName")) {
      let encodedUrl = req.query.companyName;
      const decodedUrl = decodeURIComponent(encodedUrl);
      // console.log(decodedUrl, "decode");
      const data = await company
        .findOne(
          {
            comapnyName: { $regex: `${decodedUrl}` },
          },
          { createdAt: 0 }
        )
        .lean();
      // let kycstatus = await kyc
      //   .findOne({ company_email: data.business_email })
      //   .lean();
      // let allData = { ...data };
      // allData["cacdocument"] = kycstatus.cacdocument
      //   ? kycstatus.cacdocument
      //   : "";
      // allData["tccdocument"] = kycstatus.tccdocument
      //   ? kycstatus.tccdocument
      //   : "";
      // allData["itfdocument"] = kycstatus.itfdocument
      //   ? kycstatus.itfdocument
      //   : "";
      // allData["pancomdocument"] = kycstatus.pancomdocument
      //   ? kycstatus.pancomdocument
      //   : "";

      return res.status(200).send({ status: 200, data });
    } else if (Object.keys(req.query).includes("business_email")) {
      let encodedUrl = req.query.business_email;
      const decodedUrl = decodeURIComponent(encodedUrl);
      // console.log(decodedUrl, "decode");
      const data = await company
        .findOne(
          {
            business_email: { $regex: `${decodedUrl}` },
          },
          { createdAt: 0 }
        )
        .lean();
      return res.status(200).send({ status: 200, data });
    } else if (Object.keys(req.query).includes("rcNumber")) {
      let encodedUrl = req.query.rcNumber;
      const decodedUrl = decodeURIComponent(encodedUrl);
      // console.log(decodedUrl, "decode");
      const data = await company
        .findOne(
          {
            rcNumber: { $regex: `${decodedUrl}` },
          },
          { createdAt: 0 }
        )
        .lean();
      return res.status(200).send({ status: 200, data });
    } else {
      return res.status(200).send({ status: 200, data: null });
    }
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const searchemployeedetails = async (req, res) => {
  try {
    if (Object.keys(req.query).includes("email")) {
      let encodedUrl = req.query.email;
      const decodedUrl = decodeURIComponent(encodedUrl);
      // console.log(decodedUrl, "decode");
      const data = await employee
        .findOne(
          {
            empemail: { $regex: `${decodedUrl}` },
          },
          { createdAt: 0 }
        )
        .lean();
      if (typeof data.kyc_status === "boolean") {
        if (data.kyc_status === false) {
          data["kyc_status"] = "pending";
          return res.status(200).send({ status: 200, data });
        } else if (data.kyc_status === true) {
          data["kyc_status"] = "accepted";
          return res.status(200).send({ status: 200, data });
        }
      } else {
        return res.status(200).send({ status: 200, data });
      }
    } else if (Object.keys(req.query).includes("cerpac_number")) {
      let encodedUrl = req.query.cerpac_number;
      const decodedUrl = decodeURIComponent(encodedUrl);
      // console.log(decodedUrl, "decode");
      const data = await employee
        .findOne(
          {
            cerpac_number: { $regex: `${decodedUrl}` },
          },
          { createdAt: 0 }
        )
        .lean();
      if (typeof data.kyc_status === "boolean") {
        if (data.kyc_status === false) {
          data["kyc_status"] = "pending";
          return res.status(200).send({ status: 200, data });
        } else if (data.kyc_status === true) {
          data["kyc_status"] = "accepted";
          return res.status(200).send({ status: 200, data });
        }
      } else {
        return res.status(200).send({ status: 200, data });
      }
    } else if (Object.keys(req.query).includes("passportnumber")) {
      let encodedUrl = req.query.passportnumber;
      const decodedUrl = decodeURIComponent(encodedUrl);
      // console.log(decodedUrl, "decode");
      const data = await employee
        .findOne(
          {
            passportnumber: { $regex: `${decodedUrl}` },
          },
          { createdAt: 0 }
        )
        .lean();
      if (typeof data.kyc_status === "boolean") {
        if (data.kyc_status === false) {
          data["kyc_status"] = "pending";
          return res.status(200).send({ status: 200, data });
        } else if (data.kyc_status === true) {
          data["kyc_status"] = "accepted";
          return res.status(200).send({ status: 200, data });
        }
      } else {
        return res.status(200).send({ status: 200, data });
      }
    } else if (Object.keys(req.query).includes("employee_name")) {
      let encodedUrl = req.query.employee_name;
      const decodedUrl = decodeURIComponent(encodedUrl);
      console.log(decodedUrl, "decode");
      const fullName = decodedUrl; // Assuming the user provides the full name as a query parameter
      const regexFullName = new RegExp(fullName, "i"); // Create a case-insensitive regex
      const data = await employee
        .findOne(
          {
            $expr: {
              $regexMatch: {
                input: { $concat: ["$givenname", " ", "$surname"] },
                regex: regexFullName,
              },
            },
          },
          { createdAt: 0 }
        )
        .lean();
      // console.log(data);
      if (typeof data.kyc_status === "boolean") {
        // console.log("in");
        if (data.kyc_status === false) {
          data["kyc_status"] = "pending";
          return res.status(200).send({ status: 200, data });
        } else if (data.kyc_status === true) {
          data["kyc_status"] = "accepted";
          return res.status(200).send({ status: 200, data });
        }
      } else {
        return res.status(200).send({ status: 200, data });
      }
    } else {
      return res.status(200).send({ status: 200, data: null });
    }
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const cardall = async (req, res) => {
  try {
    const data = await card.find().lean();
    return res.status(200).send({ status: 200, data });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const getcardbyid = async (req, res) => {
  try {
    const data = await card.findOne({ _id: req.params._id }).lean();
    return res.status(200).send({ status: 200, data });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const createadminusers = async (req, res) => {
  try {
    // console.log(req.body);
    let emailpassword = generateUniqueAlphanumeric();
    req.body.emailpassword = emailpassword;
    const dataExist = await adminusers.findOne({ email: req.body.email });
    if (dataExist) {
      return res.status(200).send({ status: 200, message: "the user exists" });
    } else {
      const data = await adminusers.create(req.body);
      // console.log(data);
      let Subject = "EEL Admin USER CONFIRMATION";

      let text = `
Dear ${req.body.name},\n
Your user has been created successfully with EELMS help-desk portal.\n
Find below mentioned login credentials:\n
Username: ${req.body.email}\n
Password: ${emailpassword}\n
To login click on below link:\n
${eel_portal_link}
This is an automated message, please do not reply. If you need additional assistance, kindly contact to your admin.\n
 
Thank you, 
EEL Team `;
      await emailservices.sendEmail(req.body.email, Subject, text);
      // console.log(req.body);

      return res
        .status(201)
        .send({ status: 201, message: "the admin user is created" });
    }
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const adminresetpassword = async (req, res) => {
  try {
    const userexist = await adminusers.findOne({ email: req.body.email });
    // console.log(userexist);
    if (userexist) {
      // // console.log("in");
      const salt = await bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hash(req.body.newpassword, salt);
      if (userexist.emailpassword === req.body.oldpassword) {
        // console.log("in1");
        const updatePass = await adminusers.updateOne(
          {
            email: req.body.email,
          },
          {
            $set: { password: hashedPassword, Is_new_user: false },
          }
        );
        return res
          .status(200)
          .send({ message: "password changed successfully", status: 200 });
      } else {
        return res
          .status(401)
          .send({ message: "incorrect password ", status: 401 });
      }
    } else {
      // console.log("f");
      return res.status(404).send({ message: "user not exist", status: 404 });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message, status: 401 });
  }
};

const adminuserlogin = async (req, res) => {
  try {
    const adminData = await adminusers
      .findOne({ email: req.body.email })
      .lean();
    // console.log(admindData);
    // let accessToken = jwt.sign({ email: adminData.email }, secretkey, {
    //   expiresIn: "24h",
    // });

    // console.log("accessToken");
    // console.log(adminData, "adminData");
    if (!adminData) {
      return res.status(404).send({
        message: "employee not found",
        status: 404,
      });
    } else if (
      adminData.emailpassword === req.body.password &&
      Object.keys(req.body).indexOf("password") !== -1
    ) {
      let token = jwt.sign({ _id: adminData.email }, secretkey, {
        expiresIn: "24h",
      });
      let data = {};
      data = { ...adminData };
      // data["_id"] = adminData.emp_registration_id;
      data["accessToken"] = token;
      // console.log("in");
      return res.status(203).send({
        message: "change the password",
        data,
        status: 203,
      });
    } else if (req.body.password !== "") {
      let token = jwt.sign({ _id: adminData.email }, secretkey, {
        expiresIn: "24h",
      });
      // console.log("out");
      // console.log(picture);
      let decryptpasssword = await bcrypt.compare(
        req.body.password,
        adminData.password,
        (err, data) => {
          if (!data) {
            // console.log(err, "err");
            return res.status(400).send({
              message: "incorrect password",
              status: 400,
            });
          } else {
            let hdobj = {};
            hdobj = adminData;
            delete adminData.emailpassword;
            delete adminData.password;
            let data = hdobj;
            data["accessToken"] = token;
            return res.status(200).send({
              message: "user login succesfully",
              data,
              status: 200,
            });
          }
        }
      );
      // console.log("decryptpasssword");
    } else {
      return res.status(401).send({
        message: "please enter password",
        status: 401,
      });
    }

    // if (adminData) {
    //   // console.log("accessToken");
    //   let decryptpasssword = await bcrypt.compare(
    //     req.body.password,
    //     adminData.password,
    //     (err, data) => {
    //       if (!data) {
    //         // console.log(err, "err");
    //         return res.status(400).send({
    //           message: "incorrect password",
    //           status: 400,
    //         });
    //       } else {
    //         // console.log(data, "data");
    //         return res.status(200).send({
    //           message: "user login succesfully",
    //           user_type: "agent-admin",
    //           accessToken,
    //           _id: adminData._id,
    //           email: adminData.email,
    //           status: 200,
    //         });
    //       }
    //     }
    //   );
    // }
    // else {
    //   return res
    //     .status(404)
    //     .send({ message: "invalid credintials", status: 404 });
    // }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

// const getallmanagementdata = async (req, res) => {
//   try {
//     const mangementData = await managementrole
//       .find({
//         $or: [
//           { request_status: "PENDING" },
//           { request_status: "ASSIGN" },
//           { request_status: "APPROVED" },
//         ],
//       })
//       .lean();
//     // console.log(mangementData, "mangementData");
//     const agentname = await helpdeskuser.find({}).lean();
//     console.log(agentname, "agentname");
//     const changerepresentativeData = await representative
//       .find({ request_status: false })
//       .lean();
//     // console.log(changerepresentativeData, "changerepresentativeData");
//     let obj = [];
//     let data = changerepresentativeData.forEach((i) => {
//       let represetativeObj = {};
//       mangementData.map((j) => {
//         agentname.map((k) => {
//           // console.log(i._id, j.representative_request_id, k._id);
//           if (i._id.toString() === j.representative_request_id) {
//             if (k._id.toString() === j.helpdeskAgent_id) {
//               // console.log(
//               //   i._id,
//               //   j.representative_request_id,
//               //   k._id,
//               //   j.helpdeskAgent_id,
//               //   "in"
//               // );
//               represetativeObj["_id"] = i._id;
//               represetativeObj["representativerole_id"] = j._id;
//               represetativeObj["company_name"] = i.companyName;
//               represetativeObj["business_email"] = i.business_email;
//               represetativeObj["request_date"] = j.request_date;
//               represetativeObj["request_status"] = j.request_status;
//               represetativeObj["agent_name"] = k.name;
//               // console.log(represetativeObj, "in");
//               // return represetativeObj;
//             } else {
//               // console.log(
//               //   i._id,
//               //   j.representative_request_id,
//               //   k._id,
//               //   j.helpdeskAgent_id,
//               //   "oy"
//               // );
//               // console.log(i._id, j.representative_request_id, k._id);
//               represetativeObj["_id"] = i._id;
//               represetativeObj["representativerole_id"] = j._id;
//               represetativeObj["company_name"] = i.companyName;
//               represetativeObj["business_email"] = i.business_email;
//               represetativeObj["request_date"] = j.request_date;
//               represetativeObj["request_status"] = j.request_status;
//               represetativeObj["agent_name"] = "";
//               // console.log(represetativeObj, "out");

//               // return represetativeObj;
//             }
//           }
//           // console.log(represetativeObj, "represetativeObj1");
//           return represetativeObj;
//         });
//         return represetativeObj;
//       });
//       // console.log(represetativeObj, "represetativeObj1");
//       obj.push(represetativeObj);
//       // console.log(obj, "obj");
//     });
//     let objlength = Object.keys(obj[0]);
//     if (objlength.length) {
//       return res.status(200).send({ status: 200, data: obj });
//     } else {
//       return res.status(200).send({ status: 200, data: [] });
//     }
//   } catch (error) {
//     return res.status(401).send({ message: error.message });
//   }
// };

const getallmanagementdata = async (req, res) => {
  try {
    const mangementData = await managementrole
      .find({
        $or: [
          { request_status: "PENDING" },
          { request_status: "ASSIGN" },
          { request_status: "APPROVED" },
        ],
      })
      .lean();
    // console.log(mangementData, "mangementData");
    const agentname = await helpdeskuser.find({}).lean();
    // console.log(agentname, "agentname");
    const changerepresentativeData = await representative
      .find({ request_status: false })
      .lean();
    // console.log(changerepresentativeData, "changerepresentativeData");
    let obj = [];
    // let result = {
    //   status: 200,
    //   data: [],
    // };
    // let data = changerepresentativeData.forEach((changeRepData) => {
    //   let matchingManagementData = mangementData.map(
    //     (mgmtData) => mgmtData.representative_request_id === changeRepData._id
    //   );
    //   console.log(matchingManagementData);
    //   if (matchingManagementData) {
    //     let agentName = "";
    //     console.log(matchingManagementData.helpdeskAgent_id);
    //     if (matchingManagementData.helpdeskAgent_id) {
    //       let matchingAgent = agentname.find(
    //         (agent) => agent._id === matchingManagementData.helpdeskAgent_id
    //       );
    //       if (matchingAgent) {
    //         agentName = matchingAgent.name;
    //       }
    //     }
    //     result.data.push({
    //       _id: changeRepData._id,
    //       representativerole_id: matchingManagementData._id,
    //       company_name: changeRepData.companyName,
    //       business_email: changeRepData.business_email,
    //       request_date: changeRepData.request_date,
    //       request_status: matchingManagementData.request_status,
    //       agent_name: agentName,
    //     });
    //   } else {
    //     result.data.push({
    //       _id: changeRepData._id,
    //       representativerole_id: matchingManagementData,
    //       company_name: changeRepData.companyName,
    //       business_email: changeRepData.business_email,
    //       request_date: changeRepData.request_date,
    //       request_status: matchingManagementData.request_status,
    //       agent_name: "",
    //     });
    //   }
    // });

    // console.log(result);

    let result = {
      status: 200,
      data: changerepresentativeData.map((changeRepData) => {
        let matchingManagementData = mangementData.find((mgmtData) => {
          // console.log(
          //   mgmtData.representative_request_id,
          //   changeRepData._id.toString(),
          //   "mgmtData"
          // );
          return (
            mgmtData.representative_request_id === changeRepData._id.toString()
          );
        });
        // console.log("here");

        let agentName = "";
        // console.log(matchingManagementData, "_ID");

        if (matchingManagementData && matchingManagementData.helpdeskAgent_id) {
          // console.log("here1");

          let matchingAgent = agentname.find((agent) => {
            // console.log(agent, "agent");
            return (
              agent._id.toString() === matchingManagementData.helpdeskAgent_id
            );
          });
          // console.log(matchingAgent, "matchingAgent");
          if (matchingAgent) {
            agentName = matchingAgent.name;
          }
        }
        // console.log(
        //   "_id:",
        //   changeRepData._id,
        //   "representativerole_id:",
        //   matchingManagementData._id,
        //   "company_name:",
        //   changeRepData.companyName,
        //   "business_email:",
        //   changeRepData.old_business_email,
        //   "request_date:",
        //   changeRepData.request_date,
        //   "request_status:",
        //   matchingManagementData.request_status,
        //   "agent_name:",
        //   agentName,
        //   "here3"
        // );

        return {
          _id: changeRepData ? changeRepData._id.toString() : "",
          representativerole_id: matchingManagementData
            ? matchingManagementData._id.toString()
            : "",
          company_name: changeRepData ? changeRepData.companyName : "",
          business_email: changeRepData ? changeRepData.old_business_email : "",
          request_date: changeRepData ? changeRepData.request_date : "",
          request_status: matchingManagementData
            ? matchingManagementData.request_status
            : "",
          agent_name: agentName ? agentName : "",
        };
      }),
    };
    // console.log(result, "result");

    // let objlength = Object.keys(obj[0]);
    // if (objlength.length) {
    return res.status(200).send(result);
    // } else {
    //   return res.status(200).send({ status: 200, data: [] });
    // }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const getrepresetstivedata = async (req, res) => {
  try {
    const objData = await representative
      .findOne(
        {
          _id: req.params.request_id,
        },
        { password: 0 }
      )
      .lean();
    // console.log(objData, "objdata");
    const data = await managementrole
      .findOne({
        representative_request_id: objData._id,
      })
      .lean();
    // console.log(data, "data");

    const agentname = await helpdeskuser
      .findOne({ _id: data.helpdeskAgent_id })
      .lean();
    // console.log(agentname, "agentname");
    let obj = {};
    obj = { ...objData };
    obj["representativerole_id"] = data._id;
    obj["business_email"] = objData.new_business_email;
    obj["request_date"] = data.request_date;
    obj["request_status"] = data.request_status;
    obj["agent_name"] = agentname ? agentname.name : "";
    obj["helpdesk_cac_docurl_status"] = data
      ? data.helpdesk_cac_docurl_status
      : "";
    obj["helpdesk_other_docurl_status"] = data
      ? data.helpdesk_other_docurl_status
      : "";
    obj["cto_cac_docurl_status"] = data ? data.cto_cac_docurl_status : "";
    obj["cto_other_docurl_status"] = data ? data.cto_other_docurl_status : "";
    obj["management_cac_docurl_status"] = data
      ? data.management_cac_docurl_status
      : "";
    obj["management_other_docurl_status"] = data
      ? data.management_other_docurl_status
      : "";
    obj["helpdeskAgent_details_status"] = data
      ? data.helpdeskAgent_details_status
      : "";
    obj["cto_details_status"] = data ? data.cto_details_status : "";
    obj["management_details_status"] = data
      ? data.management_details_status
      : "";

    // console.log(objData);
    res.status(200).send({ status: 200, data: obj });
    return response.data.pipe(res);
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const adminassign = async (req, res) => {
  try {
    const data = await managementrole.find({ _id: req.body._id }).lean();
    // console.log(data);
    if (data) {
      const updateData = await managementrole.updateMany(
        {
          _id: { $in: req.body.request_ids },
          // request_status: "PENDING" || "ASSIGN",
        },
        {
          $set: {
            helpdeskAgent_id: req.body._id,
            request_status: "ASSIGN",
            allocation_date: moment(new Date()).format("DD/MM/YYYY"),
          },
        }
        // {
        //   _id: req.body._id,
        //   request_status: "PENDING",
        // },
        // {
        //   $set: req.body,
        // }
      );
      return res
        .status(200)
        .send({ status: 200, message: "helpdesk agent assigned" });
    } else {
      return res.status(203).send({ status: 203, message: "user not found" });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const getadminuserbytoken = async (req, res) => {
  try {
    const authtoken = req.headers.authorization;
    const token = authtoken.split(" ")[1];
    // console.log(token, "token");
    const email = jwt.decode(token);
    // console.log(email, "email");
    const data = await adminusers
      .findOne({ email: email._id }, { emailpassword: 0, password: 0 })
      .lean();
    // const data =  const data = jwt.decode(req.body.token);
    // console.log(data);
    let accessToken = jwt.sign({ email: data.email }, secretkey, {
      expiresIn: "24h",
    });
    let obj = {};
    obj = { ...data };
    obj["accessToken"] = accessToken;
    return res.status(200).send({ status: 200, data: obj });
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const assigncard = async (req, res) => {
  try {
    const cardsData = await card.findOne({ _id: id }).lean();

    //  const updatecard = await card.updateOne({
    //   _id:req.params.id
    //  },{$set:{
    //           emp_registration_id:
    //           emp_profile_photo:
    //           card_issue_date:
    //           mereg_no:
    //           card_holder_name:
    //           nationality:
    //           passport_number:
    //           cerpac_number:
    //           cerpac_validity:
    //           passport_validaity:
    //           designation:
    //  }})
    return res.status(200).send({ status: 200, data: deletedCards });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const getallcardprintingrequest = async (req, res) => {
  try {
    const data = await cardprint
      .find(
        {},
        {
          emp_full_name: 1,
          company_email: 1,
          request_date: 1,
          request_status: 1,
          card_number: 1,
          company_name: 1,
          printing_agent_id: 1,
        }
      )
      .lean();
    let cardprintids = data.map((i) => i.printing_agent_id);
    // console.log(cardprintids, "cardprintids");
    // console.log(cardprintids, "cardprintids");
    const cardprintName = await helpdeskuser
      .find({ _id: { $in: cardprintids } })
      .lean();
    let finalObj = data.map((dataId) => {
      // let employeeData = empdata.find((employedata) => {
      //   return employedata._id.toString() === dataId.employee_id;
      // });
      // console.log(dataId, "deleted");
      let cardprintingname = "";
      // if (dataId && dataId.agent_id) {
      let matchingAgent = cardprintName.find((agent) => {
        // console.log(agent, "dataId.agent_id");
        return agent._id.toString() === dataId.printing_agent_id;
      });
      if (matchingAgent) cardprintingname = matchingAgent.name;
      // }
      console.log(matchingAgent, "matchingAgent");

      if (dataId) {
        return {
          id: dataId._id.toString(),
          company_name: dataId.company_name,
          company_email: dataId.company_email,
          card_number: dataId.card_number,
          card_holder_name: dataId.emp_full_name,
          request_date: dataId.request_date,
          request_status: dataId.request_status,
          agent_name: cardprintingname,
        };
      }
    });
    let result = {
      status: 200,
      data: finalObj,
    };
    console.log(finalObj.length);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const getalldispatchrequest = async (req, res) => {
  try {
    const data = await cardprint
      .find(
        {},
        {
          emp_full_name: 1,
          company_email: 1,
          request_date: 1,
          request_status: 1,
          card_number: 1,
          company_name: 1,
          dispatching_agent_id: 1,
        }
      )
      .lean();
    // let cardprintids = data.map((i) => i.printing_agent_id);
    let dispacthtids = data.map((i) => i.dispatching_agent_id);

    // const cardprintName = await helpdeskuser
    //   .find({ _id: { $in: cardprintids } })
    //   .lean();
    const dispatchagentName = await helpdeskuser
      .find({ _id: { $in: dispacthtids } })
      .lean();
    let finalObj = data.map((dataId) => {
      // let employeeData = empdata.find((employedata) => {
      //   return employedata._id.toString() === dataId.employee_id;
      // });
      // console.log(deletedData, "deleted");
      let dispatchagentname = "";
      // if (dataId && dataId.agent_id) {
      let matchingAgent = dispatchagentName.find((agent) => {
        // console.log(agent, "dataId.agent_id");
        return agent._id.toString() === dataId.printing_agent_id;
      });
      // console.log(matchingAgent, "matchingAgent");
      if (matchingAgent) dispatchagentname = matchingAgent.name;
      // }
      if (dataId) {
        return {
          id: dataId._id.toString(),
          company_name: dataId.company_name,
          company_email: dataId.company_email,
          card_number: dataId.card_number,
          card_holder_name: dataId.emp_full_name,
          request_date: dataId.request_date,
          request_status: dataId.request_status,
          agent_name: dispatchagentname,
        };
      }
    });
    let result = {
      status: 200,
      data: finalObj,
    };
    // console.log(finalObj.length);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const getcardprintingrequestbyid = async (req, res) => {
  try {
    const data = await cardprint.findOne({ _id: req.params.request_id }).lean();
    // console.log(data);
    const empdata = await employee.findOne({ _id: data.employee_id }).lean();
    const agentname = await helpdeskuser
      .findOne({ _id: data.printing_agent_id })
      .lean();
    let dataObj = {
      id: data._id,
      company_name: data.company_name,
      company_email: data.company_email,
      card_holder_name: data.emp_full_name,
      card_number: data.card_number,
      request_date: data.request_date,
      request_status: data.request_status,
      agent_name: agentname ? agentname.name : "",
      employee_id: data.employee_id,
      ...empdata,
    };
    return res.status(200).send({ status: 200, data: dataObj });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const cardprintingassign = async (req, res) => {
  try {
    const assignagent = await cardprint.updateMany(
      {
        _id: { $in: req.body.request_ids },
      },
      {
        $set: {
          printing_agent_id: req.body.help_desk_user_id,
          request_status: "INITIATED",
        },
      }
    );
    return res
      .status(200)
      .send({ status: 200, message: "user assign succussfully" });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const cardDispatchassign = async (req, res) => {
  try {
    const assignagent = await cardprint.updateMany(
      {
        _id: { $in: req.body.request_ids },
      },
      {
        $set: {
          dispatching_agent_id: req.body.help_desk_user_id,
          request_status: "SHIPPING",
        },
      }
    );
    return res
      .status(200)
      .send({ status: 200, message: "user assign succussfully" });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const getallemployeeexempt = async (req, res) => {
  try {
    const exemptData = await employee_exempt
      .find({
        $or: [{ request_status: "PENDING" }, { request_status: "ASSIGN" }],
      })
      .lean();
    let allData = [];
    allData = exemptData;
    const agentNamedata = await helpdeskuser.find({}).lean();
    let agentids = allData.map((item) => {
      let allelements = [];
      allelements = item;
      agentNamedata.forEach((element) => {
        // console.log(element._id.toString(), "all");
        if (allelements.helpdesk_agent_id === element._id.toString()) {
          // console.log(element, "ele");
          allelements["agentName"] = element.name;
        } else {
          allelements["agentName"] = "";
        }
        // allelements.push(item);
      });
      return allelements;
    });
    // console.log(agentids, "agentids");
    return res.status(200).send({ status: 200, data: agentids });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const getemployeeexemptbyid = async (req, res) => {
  try {
    const exemptData = await employee_exempt
      .findOne({ _id: req.params.request_id })
      .lean();
    const agentNamedata = await helpdeskuser
      .findOne({ _id: exemptData.helpdesk_agent_id })
      .lean();
    // console.log(agentNamedata, "data");
    let data = {};
    data = exemptData;
    data["agentName"] = agentNamedata ? agentNamedata.name : "";
    // console.log(data, "data")s;
    return res.status(200).send({ status: 200, data });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

const assignemployeeexempt = async (req, res) => {
  try {
    const data = await employee_exempt.updateOne(
      {
        _id: { $in: req.body.request_ids },
      },
      {
        $set: {
          helpdesk_agent_id: req.body._id,
          request_status: "ASSIGN",
          allocation_date: moment(new Date()).format("DD/MM/YYYY"),
        },
      }
    );
    return res
      .status(200)
      .send({ status: 200, message: "agent assign successfully" });
  } catch (error) {
    return res.status(401).send({ status: 401, message: error.message });
  }
};

module.exports = {
  deleteemployee,
  fetchrequest,
  changepassword,
  resetpassword,
  documenturl,
  getdeletemeployee,
  getallpassword,
  changestate,
  getcompanydocs,
  companyforgotpassword,
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
  employeekycbyid,
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
  resetforgotpassword,
  assignenquiry,
  assigndeleteemployeerequest,
  serachcompanydetails,
  searchemployeedetails,
  cardall,
  getcardbyid,
  createadminusers,
  getallmanagementdata,
  getrepresetstivedata,
  adminresetpassword,
  adminuserlogin,
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
};
