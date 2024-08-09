const { createUser, matches } = require("./user.service");
const user = require("../../model/user.model");
const company = require("../../model/company.model");
const contact = require("../../model/contactus.model");
const companydocs = require("../../model/user.forgetpassword.model");
const enquiry = require("../../model/enquiry.eelms");
const nodemailer = require("nodemailer");
const kyc = require("../../model/comapny_kyc_status.model");
const representative = require("../../model/change_representative.model");
const adminusers = require("../../model/admin_users.model");
const managementRole = require("../../model/management_role.model");
const companyData1 = require("../../model/company_data.model");

const sendEmail = require("./user.service");
const {
  validation,
  loginvalid,
  changerepresentativevalidation,
  emailvalid,
} = require("../user/user.validation");
const { registermail } = require("../../utils/htmloutput");
var publicKEY = process.env.public_key;
let verification_link = process.env.verification_link;
const emailservices = require("../../services/email.service");
const bcrypt = require("bcrypt");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const { object } = require("joi");
require("dotenv").config();
const fs = require("fs");
const email_link = process.env.verified_uri;
var privateKEY = `${process.env.private_key}`;

// const config = require("../../src/config/config")

const createuser = async (req, res) => {
  try {
    // console.log(req.body,"req")
    const salt = await bcrypt.genSaltSync(10);
    let mail = [];
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const response = validation.validate(req.body);
    let businessEmail = req.body.businessEmail.toLowerCase();

    // console.log(hashedPassword, "res");
    if (response.error) {
      // console.log(response.error.details[0].message)
      return res
        .status(401)
        .send({ message: response.error.details[0].message, status: 401 });
    } else {
      const existedUser = await user.findOne({
        businessEmail,
      });
      const rcalreadyexist = await user.findOne({
        rcNumber: req.body.rcNumber,
      });
      if (existedUser) {
        return res.status(400).send({ message: "user exist", status: 400 });
      } else if (rcalreadyexist) {
        return res
          .status(400)
          .send({ message: "RC Number already registered", status: 400 });
      } else {
        // let data = {}
        let payload = { email: businessEmail };
        const token = jwt.sign(payload, "ourSecretKey", { expiresIn: "48h" });
        req.body.accessToken = token;
        // console.log(token);
        data = req.body;
        req.body.password = hashedPassword;

        //     let registermail = `Dear ${req.body.comapnyName},\n
        // Welcome to the EEL Portal.\n
        // To complete your registration and gain full access to our platform, please confirm your email address\n by clicking the link below: ${email_link}/${token}\n
        // If you are unable to click the link, please copy and paste the following URL into your web browser's\n address bar: ${email_link}/${token}\n
        // Please note that this confirmation link will expire in 48 hours for security reasons.\n
        // This is an automated message, please do not reply.\n
        // If you need additional assistance, please contact enquiries@eel.interior.gov.ng \n
        // Thank you,\n
        // EEL Team `;
        //     let subject =
        //       " Welcome to EEL Online Portal- Please Confirm Your Registration ";

        let subject =
          " Welcome to EEL Online Portal- Please Confirm Your Registration";

        let registermail = `Dear ${req.body.comapnyName},\n

        Thank you for registering with EEL Online portal. We're excited to welcome you to our platform!\n

        To complete your registration and unlock the full potential of our services, please verify your email address by clicking the link below:\n

       ${email_link}/${token}verification link \n

        If you are unable to click the link, please copy and paste the following URL into your web browser's address bar.\n

        Please note that this confirmation link will expire in 48 hours for security reasons. This is an automated message, please do not reply.\n

        If you have any questions or concerns regarding EEL, please do not hesitate to contact our customer support team at enquiries.eel@eel.interior.gov.ng or +234-7080647200.\n

        Thank you,\n
        EEL Team`;
        let html = emailservices.sendEmail(
          businessEmail,
          subject,
          registermail
        );
        // console.log(email_link, "email_link");
        const userCreated = await user.create(req.body);
        await emailservices.sendEmail(businessEmail, subject, html);
        return res.status(201).send({
          message: "login through email",
          is_moi_verified: req.body.is_moi_verified,
          status: 201,
        });
      }
    }
  } catch (error) {
    return res.status(401).send({ message: error.message, status: 401 });
  }
};

const emailverified = async (req, res) => {
  try {
    //first approchvalidate the incoming token with jwt
    //if token is valid extract the information from token
    //if token is valid then extract mail and  update the email_verification
    const data = jwt.decode(req.body.token);
    // console.log(data);
    const email = data.email;
    // console.log(email);
    const emailData = await user.findOne({
      businessEmail: email,
      is_emial_verified: false,
    });
    // console.log(emailData);
    if (emailData) {
      const update = await user.updateOne(
        {
          businessEmail: email,
        },
        {
          $set: {
            is_emial_verified: true,
          },
        }
      );
      return res
        .status(200)
        .send({ message: "email verified succefully", status: 200 });
    } else {
      return res
        .status(401)
        .send({ message: "email already verified", status: 401 });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message, status: 401 });
  }
};

// const verifiedrcnumber = async (req, res) => {
//   try {
//     const recnumberExist = await user.findOne({
//       rcNumber: req.params.rcnumber,
//     });
//     if (recnumberExist) {
//       return res.status(200).send({ message: "rcNumber exist", status: 200 });
//     } else {
//       return res
//         .status(204)
//         .send({ message: "rcNumber not found", status: 204 });
//     }
//   } catch (error) {
//     return res.status(401).send({ message: error.message, status: 401 });
//   }
// };

const verifiedrcnumber = async (req, res) => {
  try {
    const recnumberUserExist = await user.findOne({
      rcNumber: req.params.rcnumber,
    });
    if (recnumberUserExist) {
      return res.status(302).send({
        data: null,
        message: "RC number alredy registered",
        status: 302,
      });
    } else {
      // console.log(typeof `RC-${req.params.rcnumber}`,"`RC-${req.params.rcnumber}`")
      const recnumberCompanydataExist = await companyData1.findOne({
        RCNumber: `RC-${req.params.rcnumber}`,
      });
      if (recnumberCompanydataExist) {
        return res.status(200).send({
          data: recnumberCompanydataExist,
          message: "Success",
          is_moi_verified: true,
          status: 200,
        });
      } else {
        return res.status(203).send({
          data: null,
          is_moi_verified: false,
          message: "data not available",
          status: 203,
        });
      }
    }
  } catch (error) {
    return res.status(401).send({ message: error.message, status: 401 });
  }
};

const resendemail = async (req, res) => {
  try {
    const data = jwt.decode(req.body.token);
    // console.log(data);
    const email = data.email;
    // console.log(email);
    // console.log(req.body.token);

    const emailData = await user.findOne({
      businessEmail: email,
      accessToken: req.body.token,
    });
    // console.log(emailData, "hi");
    let payload = { email: emailData.businessEmail };
    const token = jwt.sign(payload, "ourSecretKey", { expiresIn: "48h" });
    // let registermail = `Dear ${emailData.comapnyName},\n
    // Welcome to the EEL Portal.\n
    // To complete your registration and gain full access to our platform, please confirm your email address\n by clicking the link below: ${email_link}/${token}\n
    // If you are unable to click the link, please copy and paste the following URL into your web browser's\n address bar: ${email_link}/${token}\n
    // Please note that this confirmation link will expire in 48 hours for security reasons.\n
    // This is an automated message, please do not reply.\n
    // If you need additional assistance, please contact enquiries@eel.interior.gov.ng \n
    // Thank you,\n
    // EEL Team `;
    let subject =
      " Welcome to EEL Online Portal- Please Confirm Your Registration ";
    let html = registermail(req.body.comapnyName, email_link, token);

    // console.log(req.body);
    // console.log(registermail);
    const email_Data = await user.findOne({ businessEmail: email });
    if (emailData) {
      if (emailData.is_emial_verified === false) {
        await emailservices.sendEmail(email, subject, html);
        const updateToken = await user.updateOne(
          { businessEmail: emailData.businessEmail },
          {
            $set: {
              accessToken: token,
            },
          }
        );
        return res
          .status(200)
          .send({ message: "check your email", status: 200 });
      } else {
        return res
          .status(404)
          .send({ message: "can not find you mail", status: 404 });
      }
    } else {
      return res.status(401).send({ message: "not valid token", status: 401 });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message, status: 401 });
  }
};

const login = async (req, res) => {
  let businessEmail = req.body.businessEmail.toLowerCase();

  const token = jwt.sign(
    { businessEmail: businessEmail },
    process.env.secretkey,
    {
      expiresIn: "24h",
      // algorithm: ["RS256"],
    }
  ); 
  // let i = "Mysoft corp"; // Issuer
  // let s = "some@user.com"; // Subject
  // let a = "http://mysoftcorp.in";
  // let signOptions = {
  //   //   // issuer: i,
  //   //   // subject: s,
  //   //   // audience: a,
  //   expiresIn: "24h",
  //   // algorithm: "RS1024",
  // };
  // let payload = { businessEmail: req.body.businessEmail };
  // console.log(Token);
  const response = loginvalid.validate(req.body);
  try {
    // var privateKEY = fs.readFileSync("./private.key", "utf8");
    // var publicKEY = fs.readFileSync("./public.key", "utf8");
    // console.log(privateKEY, "privateKEY");
    // let token = jwt.sign(payload, privateKEY, signOptions);

    const data = await user.findOne(
      {
        businessEmail: { $regex: businessEmail, $options: "i" },
        emp_active_status: true,
        is_emial_verified: true,
      },
      {
        securityQuestion1: 0,
        securityAnswer1: 0,
        securityQuestion2: 0,
        securityAnswer2: 0,
        securityQuestion3: 0,
        securityAnswer3: 0,
      }
    );
    // console.log(data, "d");
    if (response.error) {
      return res
        .status(401)
        .send({ message: response.error.details[0].message, status: 401 });
    } else if (!data) {
      return res.status(404).send({
        message: "user not found",
        status: 404,
      });
    } else if (data) {
      // console.log("pass3");
      if (data.forgetpassword_attempt < 3 && data.loginattempt < 3) {
        // console.log("pass4");
        let decryptpasssword = await bcrypt.compare(
          req.body.password,
          data.password
        );
        // console.log(decryptpasssword, "pass");
        if (decryptpasssword) {
          // console.log("pass1");
          data.accessToken = token;
          const compnyexist = await company.findOne({ userid: data._id });
          if (compnyexist) {
            return res.status(200).send({
              message: "user login successfully",
              data: {
                newuser: false,
                _id: data.id,
                kyc_status: compnyexist.kyc_status,
                accessToken: token,
                is_temperory_password_active: data.is_temperory_password_active,
              },
              status: 200,
            });
          } else {
            // console.log("pass2");
            return res.status(200).send({
              message: "user login successfully",
              data: {
                newuser: true,
                kyc_status: "PENDING",
                _id: data.id,
                accessToken: token,
                is_temperory_password_active: data.is_temperory_password_active,
              },
              status: 200,
            });
          }
          // return res.status(200).send({ message: "user login successfully", data, "status": 200 })
        } else if (!decryptpasssword) {
          // console.log("12344");
          let counter = data.loginattempt;
          if (counter < 3) {
            counter++;
            let loginAttempt = await user.updateOne(
              { _id: data._id },
              { $set: { loginattempt: counter } }
            );
            return res.status(401).send({
              message: `you have ${3 - counter} attempt left`,
              counter,
              status: 401,
            });
          } else {
            //             let subject = `EEL portal - Account Locked`;
            //             let accountlockedmail = `Dear ${req.body.comapnyName},

            // We are writing to inform you that your EEL account has been temporarily locked for security\n
            // reasons. Your safety and the security of your account are our top priorities, and we are taking this\n
            //  action to protect your information.\n

            // Reason for Account Lock: \n
            // The account was locked due to multiple failed login attempts. \n
            // To regain access to your account, please click the link below to complete the Process. \n
            // [ Link]
            // This is an automated message, please do not reply.\n
            // If you need additional assistance, or you did not make this change, please contact \n
            // enquiries@eel.interior.gov.ng\n
            // Thank you, \n
            // EEL Team `;
            //             await emailservices.sendEmail(
            //               req.body.businessEmail,
            //               subject,
            //               accountlockedmail
            // );
            return res
              .status(401)
              .send({ message: "your account is locked", status: 401 });
          }
        }
      } else {
        return res
          .status(401)
          .send({ message: "your login is failed", status: 401 });
      }
    }
  } catch (error) {
    // console.log(error.message, "error");
    return res.status(401).send({ message: error.message, status: 401 });
  }
};

const emailvalidate = async (req, res) => {
  try {
    // const authtoken = req.headers.authorization;
    // const token = authtoken.split(" ")[1];
    // // console.log(token, "token");
    // const email = jwt.decode(token);
    // console.log(email, "email");
    // const fetchdata = await user.findOne({
    //   businessEmail: email.businessEmail,
    // });
    // console.log(fetchdata, "fetchdata");
    let businessEmail = req.body.businessEmail.toLowerCase();

    const userexist = await user
      .findOne(
        { businessEmail: businessEmail },
        {
          securityQuestion1: 1,
          securityQuestion2: 1,
          securityQuestion3: 1,
          loginattempt: 1,
          forgetpassword_attempt: 1,
        }
      )
      .lean();
    // console.log("in");

    // console.log(userexist);

    if (!userexist) {
      return res
        .status(404)
        .send({ message: "business email doesn't exist", status: 404 });
    } else if (
      userexist.loginattempt <= 3 &&
      userexist.forgetpassword_attempt < 3
    ) {
      // console.log("in");
      return res.status(200).send({
        data: userexist,
        status: 200,
      });
    } else if (
      userexist.loginattempt <= 3 &&
      userexist.forgetpassword_attempt === 3
    ) {
      // console.log("in1");
      const kycExist = await companydocs
        .findOne({ email: businessEmail })
        .lean();
      if (!kycExist) {
        // console.log("in2");

        return res.status(400).send({
          message: "Your account is locked , please upload documents",
          status: 400,
        });
      } else if (kycExist.request_status === false) {
        // console.log("in3");
        return res.status(401).send({
          message:
            "Your request hase been already submitted , you will receive notification on your registered email,",
          status: 401,
        });
      } else if (kycExist.request_status === true) {
        return res.status(200).send({ data: userexist, status: 200 });
      }
    }
  } catch (error) {
    return res.status(401).send({ message: error.message, status: 401 });
  }
};

const checkemail = async (req, res) => {
  try {
    let businessEmail = req.body.businessEmail.toLowerCase();

    const data = await user.find({ businessEmail: businessEmail });
    // console.log(data)
    if (data.length) {
      return res.status(200).send({ message: "the mail exist", status: 200 });
    } else {
      return res
        .status(204)
        .send({ message: "the mail does not exist", status: 204 });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message, status: 401 });
  }
};

const forgetpassword = async (req, res) => {
  try {
    let businessEmail = req.body.businessEmail.toLowerCase();
    const data = await user.findOne({
      businessEmail: businessEmail,
    });
    // console.log(data)
    let counter = data.forgetpassword_attempt;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    if (data) {
      if (
        data.securityAnswer1 === req.body.securityAnswer1 &&
        data.securityAnswer2 === req.body.securityAnswer2 &&
        data.securityAnswer3 === req.body.securityAnswer3
      ) {
        // console.log("success")
        const updateData = await user.updateOne(
          { businessEmail: businessEmail },
          {
            $set: {
              password: hashedPassword,
              forgetpassword_attempt: 0,
              loginattempt: 0,
            },
          }
        );

        let subject = "EEL portal - Password change confirmation";
        let passwordmail = `
        Dear ${data.comapnyName}, 
We are writing to confirm that the password for your EEL account has been successfully changed. Your account security is of utmost importance to us, and we want to ensure that your information remains safe and protected.\n 
 
This is an automated message, please do not reply.\n
If you have any questions or concerns regarding EEL portal, please do not hesitate to contact our customer support team at enquiries.eel@eel.interior.gov.ng or +234-7080647200. \n

Thank you, 
EEL Team`;
        await emailservices.sendEmail(
          data.businessEmail,
          subject,
          passwordmail
        );
        return res.status(200).send({ message: "user can login", status: 200 });
      } else if (counter < 3) {
        // console.log(counter, "log")
        counter++;
        // console.log(counter,"count")
        const updateData = await user.updateOne(
          { businessEmail: businessEmail },
          {
            $set: { forgetpassword_attempt: counter },
          }
        );
        return res.status(403).send({
          message: `you have ${3 - counter} attempt left`,
          status: 403,
        });
      } else {
        return res
          .status(401)
          .send({ message: `login attempt failed`, status: 401 });
      }
    }
  } catch (error) {
    return res.status(401).send({ message: error.message, status: 401 });
  }
};

const resetpassword = async (req, res) => {
  try {
    let businessEmail = req.body.businessEmail.toLowerCase();

    const data = await user.findOne({ businessEmail: businessEmail });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    if (data.is_temperory_password_active === true) {
      const updateData = await user.updateOne(
        { businessEmail: businessEmail },
        {
          $set: {
            is_temperory_password_active: false,
            password: hashedPassword,
          },
        }
      );
      //       subject = " EEL portal - reset your password";
      //       let mailtext = `Dear ${data.comapnyName},\n
      // We’ve received your request to reset your password. Please click the link below to complete the\n
      // reset.\n

      // Reset Password\n

      // This is an automated message, please do not reply.\n
      // If you need additional assistance, or you did not make this change, please contact\n
      // enquiries@eel.interior.gov.ng\n
      // Thank you,\n
      // EEL Team`;
      // await emailservices.sendEmail(req.body.businessEmail,subject,mailtext)
      return res
        .status(200)
        .send({ message: "the password set successfully", status: 200 });
    } else if (data.is_temperory_password_active === false) {
      const updateData = await user.updateOne(
        { businessEmail: businessEmail },
        {
          $set: { password: hashedPassword },
        }
      );
      return res
        .status(200)
        .send({ message: "the password set successfully", status: 200 });
    } else {
      return res
        .status(404)
        .send({ message: "the email was not found", status: 404 });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const resetauthpassword = async (req, res) => {
  try {
    let businessEmail = req.body.businessEmail.toLowerCase();

    const data = await user.findOne({ businessEmail: businessEmail });
    let decryptpasssword = await bcrypt.compare(
      req.body.oldpassword,
      data.password
    );
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.newpassword, salt);
    if (decryptpasssword) {
      if (data.is_temperory_password_active) {
        if (data.is_temperory_password_active === true) {
          let updatePassword = await user.updateOne(
            { _id: data._id },
            {
              $set: {
                password: hashedPassword,
                is_temperory_password_active: false,
              },
            }
          );
          return res
            .status(200)
            .send({ message: "the pasword reset succussfully", status: 200 });
        } else if (data.is_temperory_password_active === false) {
          let updatePassword = await user.updateOne(
            { _id: data._id },
            {
              $set: {
                password: hashedPassword,
              },
            }
          );

          let subject = "EEL portal - Password change confirmation";
          let passwordmail = `
      Dear ${data.comapnyName}, 
We are writing to confirm that the password for your EEL account has been successfully changed. Your account security is of utmost importance to us, and we want to ensure that your information remains safe and protected.\n 

This is an automated message, please do not reply.\n
If you have any questions or concerns regarding EEL portal, please do not hesitate to contact our customer support team at enquiries.eel@eel.interior.gov.ng or +234-7080647200. \n

Thank you, 
EEL Team`;
          await emailservices.sendEmail(
            data.businessEmail,
            subject,
            passwordmail
          );
          return res
            .status(200)
            .send({ message: "the pasword reset succussfully", status: 200 });
        }
      } else {
        let updateAuthPassword = await user.updateOne(
          { _id: data._id },
          {
            $set: {
              password: hashedPassword,
            },
          }
        );

        let subject = "EEL portal - Password change confirmation";
        let passwordmail = `
    Dear ${data.comapnyName}, 
We are writing to confirm that the password for your EEL account has been successfully changed. Your account security is of utmost importance to us, and we want to ensure that your information remains safe and protected.\n 

This is an automated message, please do not reply.\n
If you have any questions or concerns regarding EEL portal, please do not hesitate to contact our customer support team at enquiries.eel@eel.interior.gov.ng or +234-7080647200. \n

Thank you, 
EEL Team`;
        await emailservices.sendEmail(
          data.businessEmail,
          subject,
          passwordmail
        );
        return res
          .status(200)
          .send({ message: "the pasword reset succussfully", status: 200 });
      }
    } else {
      return res
        .status(400)
        .send({ message: "old password doesn't match", status: 400 });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const getuser = async (req, res) => {
  try {
    const authtoken = req.headers.authorization;
    const token = authtoken.split(" ")[1];
    // console.log(token, "token");
    const email = jwt.decode(token);
    // console.log(email, "email");
    const fetchdata = await user.findOne({
      businessEmail: email.businessEmail,
    });
    // console.log(fetchdata, "fetchdata");
    const data = await user
      .findById(
        { _id: req.body._id, businessEmail: fetchdata.businessEmail },
        {
          password: 0,
          securityAnswer1: 0,
          securityAnswer2: 0,
          securityAnswer3: 0,
          securityQuestion1: 0,
          securityQuestion2: 0,
          securityQuestion3: 0,
        }
      )
      .lean();
    // console.log(data);
    if (fetchdata._id.toString() !== data._id.toString()) {
      return res
        .status(401)
        .send({ message: "unauthorised user", status: 401 });
    } else {
      if (data) {
        const companyExist = await company
          .findOne({ userid: req.body._id })
          .lean();
        if (companyExist) {
          const kycdata = await kyc.findOne({ userid: req.body._id }).lean();
          let alldata = {};
          alldata = { ...data };
          alldata["cacdocument"] = kycdata.cacdocument;
          alldata["tccdocument"] = kycdata.tccdocument;
          alldata["itfdocument"] = kycdata.itfdocument;
          alldata["pancomdocument"] = kycdata.pancomdocument;
          // console.log(alldata, "alldata");
          return res.status(200).send({
            data: alldata,
            newuser: false,
            kyc_status: companyExist.kyc_status,
            status: 200,
          });
        } else {
          return res.status(200).send({
            data,
            kyc_status: "PENDING",
            newuser: true,
            status: 200,
          });
        }
      } else {
        return res.status(404).send({ message: "user not found", status: 404 });
      }
    }
  } catch (error) {
    return res.status(401).send({ message: error.message, status: 401 });
  }
};

const createUserCompany = async (req, res) => {
  try {
    const response = validation.validate(req.body);
    // console.log(response,"res1")
    let businessEmail = req.body.businessEmail.toLowerCase();
    const data = await user.findOne({ businessEmail });
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //  console.log(hashedPassword,"res")
    req.body.password = hashedPassword;
    if (response.error) {
      // console.log(response.error.details[0].message)
      return res
        .status(401)
        .send({ message: response.error.details[0].message, status: 401 });
    }
    if (!data) {
      const userdata = user.create(req.body);
      userdata.userid = userdata._id;
      delete userdata._id;
      const companyinsert = company.create(userdata);
      return res.status(401).send({ message: "user created", status: 201 });
    } else {
      return res.status(401).send({ message: "user exist", status: 200 });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const sendmail = async (req, res) => {
  try {
    const to = req.body.mail;
    // console.log(email_link);
    // Set this from config or environment variable.
    const PASSWORD = "....";

    // async function send365Email(to, subject, text) {
    // try {
    //     const transportOptions = {
    //       host: "smtp.office365.com",
    //       port: "587",
    //       auth: { user: "noreply@eelnigeria.com.ng", pass: "Lap24399" },
    //       secureConnection: true,
    //       tls: { ciphers: "SSLv3" },
    //     };

    //     const mailTransport = nodemailer.createTransport(transportOptions);

    //     await mailTransport.sendMail({
    //       // from,
    //       to,
    //       // replyTo: from,
    //       subject,
    //       // html,
    //       text,
    //     });
    //   } catch (err) {
    //     console.error(`send365Email: An error occurred:`, err);
    //   }
    // }
    // let token = "jkdxklxfdklfkl";

    // send365Email(
    //   // "noreply@eelnigeria.com.ng",
    //   // to,
    //   "hkethaperaje@gmail.com",
    //   "Subject",
    //   // "<i>Hello World</i>",
    //   `${email_link}/${token}`
    // );
    let text =
      ' <a href = "${verification_link}/login/${token}">verification link</a>';
    let token = "jkrsdildslkdkl";
    let subject =
      " Welcome to EEL Online Portal- Please Confirm Your Registration";

    let htmlcontent = `<p><a href="${email_link}/${token}">verification link</a></p>`;
    let html = registermail(req.body.comapnyName, email_link, token);
    // console.log(output, "output");
    // let registermail = `Dear ${req.body.comapnyName},\n

    // Thank you for registering with EEL Online portal. We're excited to welcome you to our platform!\n

    // To complete your registration and unlock the full potential of our services, please verify your email address by clicking the link below:\n

    // <a href="${email_link}/${token}">verification link</a>

    // If you are unable to click the link, please copy and paste the following URL into your web browser's address bar.\n

    // Please note that this confirmation link will expire in 48 hours for security reasons. This is an automated message, please do not reply.\n

    // If you have any questions or concerns regarding EEL, please do not hesitate to contact our customer support team at enquiries.eel@eel.interior.gov.ng or +234-7080647200.\n

    // Thank you,\n
    // EEL Team`;

    await emailservices.sendEmail(to, subject, html);

    return res.status(200).send({ message: "the mail send" });
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const contactus = async (req, res) => {
  try {
    let businessEmail = req.body.user_email.toLowerCase();

    const fetchdata = await user.findOne({ businessEmail }).lean();
    if (fetchdata) {
      await emailservices.sendEmail(
        businessEmail,
        "enquiries@eel.interior.gov.ng",
        req.body.message
      );
    }
    req.body["request_date"] = moment(new Date()).format("DD/MM/YYYY");
    const data = await contact.create(req.body);
    return res
      .status(200)
      .send({ message: "the report has been submitted", status: 200 });
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const emailexpiry = async (req, res) => {
  try {
    const authtoken = req.headers.authorization;
    const token = authtoken.split(" ")[1];
    const mail = jwt.decode(token);
    // console.log(mail, "mail");
    var iattime = mail.iat * 1000;
    // console.log(new Date(iattime).getHours());
    var exptime = mail.exp * 1000;

    const timestamp = new Date(iattime); // The provided timestamp
    const currentTime = new Date(); // Current time

    const timestampDate = new Date(timestamp);
    const differenceInMillis = currentTime - timestampDate;

    // Convert the difference from milliseconds to seconds, minutes, hours, etc.
    const seconds = Math.floor(differenceInMillis / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    // const days = Math.floor(hours / 24);
    const userData = await user.findOne({ businessEmail: mail.email });

    // console.log("Duration since timestamp:");
    // console.log(days + " days");
    // console.log((hours % 24) + " hours");
    // console.log((minutes % 60) + " minutes");
    // console.log((seconds % 60) + " seconds");

    // console.log(new Date(exptime).getHours());
    // const now = moment();
    // const currentHours = now.hours();

    // console.log("Current Hours:", currentHours);
    let remaining_hours = hours % 24;
    if (remaining_hours > 24) {
      // console.log("in1");
      return res.status(200).send({
        status: 200,
        data: {
          is_emial_verified: userData.is_emial_verified,
          is_email_expired: true,
        },
      });
    } else {
      // console.log("in2");
      return res.status(200).send({
        status: 200,
        data: {
          is_emial_verified: userData.is_emial_verified,
          is_email_expired: false,
        },
      });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const enquiryeelms = async (req, res) => {
  try {
    // const fetchdata = await user
    //   .findOne({ businessEmail: req.body.user_email })
    //   .lean();
    // if (fetchdata) {
    //   await emailservices.sendEmail(
    //     req.body.user_email,
    //     "enquiries@eel.interior.gov.ng",
    //     req.body.message
    //   );
    // }
    let subject = ` EELMS-enquiry-${req.body.fullname}`;
    let text = `
    Dear ${req.body.fullname},

Thank you for enquiring on EEL regarding below mentioned concern.\n 

${req.body.description}

Our team will respond you within next 24-48 hrs.\n

Thanks & Regards,\n
EELMS Helpdesk team,`;
    req.body["request_date"] = moment(new Date()).format("DD/MM/YYYY");
    const data = await enquiry.create(req.body);
    await emailservices.sendEmail(req.body.user_email, subject, text);

    return res
      .status(200)
      .send({ message: "the enquiry has been submitted", status: 200 });
  } catch (error) {
    return res.status(401).send({ message: error.message, status: 401 });
  }
};

const validateManagementEmail = async (req, res) => {
  try {
    let businessEmail = req.body.business_email.toLowerCase();
    const data = await user.findOne({
      businessEmail,
    });
    const response = emailvalid.validate(req.body);
    // console.log(hashedPassword, "res");
    if (response.error) {
      // console.log(response.error.details[0].message)
      return res
        .status(401)
        .send({ message: response.error.details[0].message, status: 401 });
    } else {
      if (data) {
        return res.status(200).send({ status: 200, is_valid: true });
      } else {
        return res.status(401).send({ status: 401, message: "Invalid Email" });
      }
    }
  } catch (error) {
    return res.status(401).send({ message: error.message, status: 401 });
  }
};

const changeRepresentative = async (req, res) => {
  try {
    let businessEmail = req.body.old_business_email.toLowerCase();
    const userexist = await user.findOne({
      businessEmail,
    });
    // console.log(userexist, "userexist");
    const companyid = await company.findOne({ userid: userexist.id });
    // console.log(companyid, "com");
    const response = changerepresentativevalidation.validate(req.body);
    // console.log(hashedPassword, "res");
    if (response.error) {
      // console.log(response.error.details[0].message);
      return res
        .status(401)
        .send({ message: response.error.details[0].message, status: 401 });
    } else if (userexist) {
      // console.log("in");
      const adminId = await adminusers
        .find({
          role: "ADMIN_USER",
          role: "MANAGEMENT_ADMIN_USER",
          role: "CTO-ADMIN-USER",
        })
        .lean();
      // console.log(adminId);
      const salt = await bcrypt.genSaltSync(10);
      req.body.request_date = moment(new Date()).format("DD/MM/YYYY");
      req.body["user_id"] = userexist._id;
      req.body["companyName"] = userexist.comapnyName;
      req.body["company_id"] = companyid._id;
      const data = await representative.create(req.body);
      let admindData = adminId.map((i) => {
        let managemnt_obj = {};
        if (i.role === "admin_user_id") {
          managemnt_obj["admin_user_id"] = i._id;
        }
        if (i.role === "management_user_id") {
          managemnt_obj["management_user_id"] = i._id;
        }
        if (i.role === "cto_user_id") {
          managemnt_obj["cto_user_id"] = i._id;
        }
        managemnt_obj["representative_request_id"] = data._id;
        managemnt_obj["request_date"] = moment(new Date()).format("DD/MM/YYYY");
        return managemnt_obj;
      });
      // console.log("in1");
      const managementRoleData = await managementRole.create(admindData);
      // console.log(admindData, "admin");
      return res.status(201).send({ status: 201, message: "request created" });
    } else {
      return res.status(203).send({ status: 203, message: "user not found" });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message, status: 401 });
  }
};

const fetchCompanydataFromMoi = async (req, res) => {
  try {
    const rcNumbers = ["RC-1070497", "RC-1071447", "RC-10715"];

    for (const rcNumber of rcNumbers) {
      const response = await axios.get(
        `https://ecitibiz.interior.gov.ng/Api/Expatriate/CompanyDetails?RCNumber=${rcNumber}`,
        {
          headers: {
            SecretKey: "eCt!Sek2Pi",
          },
        }
      );

      const { companyData, quotaDetailData, quotaReturnsData } =
        response.data.Data;
      const RCNumber = response.data.Data.companyData.RCNumber;

      await companyData1.create(companyData);

      const quotaDetailDataWithRCNumber = quotaDetailData
        .flat()
        .map((data) => ({ ...data, RCNumber }));
      await companyquotaData1.insertMany(quotaDetailDataWithRCNumber);

      const quotaReturnsDataWithRCNumber = quotaReturnsData.map((data) => ({
        ...data,
        RCNumber,
      }));
      await QuotaReturnModel.insertMany(quotaReturnsDataWithRCNumber);
      // console.log(${rcNumber} added successfully)
    }
    res.status(200).json({ message: "Records added successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  createuser,
  createUserCompany,
  login,
  emailvalidate,
  forgetpassword,
  resetpassword,
  resetauthpassword,
  getuser,
  checkemail,
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
};
