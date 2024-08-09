const nodemailer = require("nodemailer");
// const config = require('../../config/config');
// const logger = require('../../config/logger');
const config = require("../../src/config/config");
const contactConfig = require("../../src/config/contacts.config");

require("dotenv").config();
const eelPortal_link = process.env.eel_portal_link;
const eelApp_link = process.env.playstore_link;
let eelurl_link = process.env.eelurl_link;
let varification_link = process.env.verification_link;
const transport = nodemailer.createTransport(config.email.smtp);
const conacttransport = nodemailer.createTransport(contactConfig.email.smtp);

/* istanbul ignore next */
if (config.env !== "test") {
  transport.verify();
  // .then(() => logger.info('Connected to email server'))
  // .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = {
    from: config.email.from,
    to,
    subject,
    text,
  };
  return await transport.sendMail(msg, (error, message) => {
    if (error) {
      // console.log(error);
    } else {
      // console.log("response",message.accepted)
      if (message.accepted.length) {
        return true;
      } else {
        return false;
      }
    }
  });
};

const sendContactEmail = async (to, subject, text) => {
  // console.log(contactConfig.email.from);
  const msg = {
    from: contactConfig.email.from,
    to,
    subject,
    text,
  };
  return await conacttransport.sendMail(msg, (error, message) => {
    if (error) {
      // console.log(error);
    } else {
      // console.log("response", message.accepted);
      if (message.accepted.length) {
        return true;
      } else {
        return false;
      }
    }
  });
};

// await emailservices.sendEmail(
//   req.body.businessEmail,
//   subject,
//   registerEmployeemail
// );

const sendcardEmail = async (to, companyname, name) => {
  let subject = `Subject: EEL- Card Generation Confirmation`;
  let url = eelApp_link;
  let html = `
  <p>
      Dear ${companyname},<br/></br>
      
      The EEL card for your Employee, ${name}, has been successfully generated.<br/></br> 
      Methods to download the EEL Card<br/></br>
       A) Company
      representatives can download the EEL Card from the Employee List section
      within the  <a href=${eelPortal_link}>link</a> Link.<br/></br> B) To access the EEL card, Employees
      can download the EEL Application by clicking on the below link and
      following steps:<br/></br> For Android Users:
      <a href=${eelApp_link}>click here</a><br/> Following the download of the EEL
      Application, please proceed with the mentioned steps<br/></br> Step 1. Sign up
      with a registered email address.<br/> Step 2. Verify Email with OTP<br/> Step 3.
      Reset your password using the temporary password received in the email.<br/>
      Step 4. Log in with your email and updated password to access the EELMS
      card.<br/></br> Please ensure that you review the details carefully to ensure
      accuracy while creating your account.<br/></br> This is an automated message,
      please do not reply. If you have any questions or concerns regarding your
      EEL Digital Card, please do not hesitate to contact our customer support
      team at<br/> </br> <a href=${eelurl_link}>link</a> or +234-7080647200. Thank
      you,<br/> EEL Help Desk
    </p>
  `;

  // let text = `Dear ${name},\n
  // We are pleased to confirm the successful generation of your Expatriate Employment Levy DIGITAL\n
  // Card. To download the EEL Digital Card, click the link below.\n
  // Download EEL Digital Card \n
  // Please ensure that you review the details carefully to ensure accuracy.\n
  // If you have any questions or concerns regarding your EEL Digital Card, please do not hesitate to\n
  // contact our customer support team at enquiries@eel.interior.gov.ng or +234 xxx xxx xxxx. \n
  // This is an automated message, please do not reply.\n
  // If you need additional assistance, please contact enquiries@eel.interior.gov.ng\n
  // Thank you,\n
  // EEL Team`;
  const msg = {
    from: config.email.from,
    to,
    subject,
    html,
  };
  return await transport.sendMail(msg, (error, message) => {
    if (error) {
      // console.log(error);
    } else {
      // console.log("response",message.accepted)
      if (message.accepted.length) {
        return true;
      } else {
        return false;
      }
    }
  });
};

const cardThirtyDaysEmail = async (to, name) => {
  let subject = `EEL portal - Card Generation`;

  let text = `Dear ${name},\n
We are pleased to confirm the successful generation of your Expatriate Employment Levy DIGITAL\n 
Card. To download the EEL Digital Card, click the link below.\n
Download EEL Digital Card \n
Please ensure that you review the details carefully to ensure accuracy.\n
If you have any questions or concerns regarding your EEL Digital Card, please do not hesitate to\n 
contact our customer support team at enquiries@eel.interior.gov.ng or +234 xxx xxx xxxx. \n
This is an automated message, please do not reply.\n
If you need additional assistance, please contact enquiries@eel.interior.gov.ng\n
Thank you,\n
EEL Team`;
  const msg = {
    from: config.email.from,
    to,
    subject,
    text,
  };
  return await transport.sendMail(msg, (error, message) => {
    if (error) {
      // console.log(error);
    } else {
      // console.log("response",message.accepted)
      if (message.accepted.length) {
        return true;
      } else {
        return false;
      }
    }
  });
};

const cardFifteenDaysEmail = async (to, name) => {
  let subject = `EEL portal - Card Generation`;

  let text = `Dear ${name},\n
We are pleased to confirm the successful generation of your Expatriate Employment Levy DIGITAL\n 
Card. To download the EEL Digital Card, click the link below.\n
Download EEL Digital Card \n
Please ensure that you review the details carefully to ensure accuracy.\n
If you have any questions or concerns regarding your EEL Digital Card, please do not hesitate to\n 
contact our customer support team at enquiries@eel.interior.gov.ng or +234 xxx xxx xxxx. \n
This is an automated message, please do not reply.\n
If you need additional assistance, please contact enquiries@eel.interior.gov.ng\n
Thank you,\n
EEL Team`;
  const msg = {
    from: config.email.from,
    to,
    subject,
    text,
  };
  return await transport.sendMail(msg, (error, message) => {
    if (error) {
      // console.log(error);
    } else {
      // console.log("response",message.accepted)
      if (message.accepted.length) {
        return true;
      } else {
        return false;
      }
    }
  });
};

const cardTenDaysEmail = async (to, name) => {
  let subject = `EEL portal - Card Generation`;

  let text = `Dear ${name},\n
We are pleased to confirm the successful generation of your Expatriate Employment Levy DIGITAL\n 
Card. To download the EEL Digital Card, click the link below.\n
Download EEL Digital Card \n
Please ensure that you review the details carefully to ensure accuracy.\n
If you have any questions or concerns regarding your EEL Digital Card, please do not hesitate to\n 
contact our customer support team at enquiries@eel.interior.gov.ng or +234 xxx xxx xxxx. \n
This is an automated message, please do not reply.\n
If you need additional assistance, please contact enquiries@eel.interior.gov.ng\n
Thank you,\n
EEL Team`;
  const msg = {
    from: config.email.from,
    to,
    subject,
    text,
  };
  return await transport.sendMail(msg, (error, message) => {
    if (error) {
      // console.log(error);
    } else {
      // console.log("response",message.accepted)
      if (message.accepted.length) {
        return true;
      } else {
        return false;
      }
    }
  });
};

const cardFiveDaysEmail = async (to, name) => {
  let subject = `EEL portal - Card Generation`;

  let text = `Dear ${name},\n
We are pleased to confirm the successful generation of your Expatriate Employment Levy DIGITAL\n 
Card. To download the EEL Digital Card, click the link below.\n
Download EEL Digital Card \n
Please ensure that you review the details carefully to ensure accuracy.\n
If you have any questions or concerns regarding your EEL Digital Card, please do not hesitate to\n 
contact our customer support team at enquiries@eel.interior.gov.ng or +234 xxx xxx xxxx. \n
This is an automated message, please do not reply.\n
If you need additional assistance, please contact enquiries@eel.interior.gov.ng\n
Thank you,\n
EEL Team`;
  const msg = {
    from: config.email.from,
    to,
    subject,
    text,
  };
  return await transport.sendMail(msg, (error, message) => {
    if (error) {
      // console.log(error);
    } else {
      // console.log("response",message.accepted)
      if (message.accepted.length) {
        return true;
      } else {
        return false;
      }
    }
  });
};

const cardZeroDaysEmail = async (to, name) => {
  let subject = `EEL portal - Card Generation`;

  let text = `Dear ${name},\n
We are pleased to confirm the successful generation of your Expatriate Employment Levy DIGITAL\n 
Card. To download the EEL Digital Card, click the link below.\n
Download EEL Digital Card \n
Please ensure that you review the details carefully to ensure accuracy.\n
If you have any questions or concerns regarding your EEL Digital Card, please do not hesitate to\n 
contact our customer support team at enquiries@eel.interior.gov.ng or +234 xxx xxx xxxx. \n
This is an automated message, please do not reply.\n
If you need additional assistance, please contact enquiries@eel.interior.gov.ng\n
Thank you,\n
EEL Team`;
  const msg = {
    from: config.email.from,
    to,
    subject,
    text,
  };
  return await transport.sendMail(msg, (error, message) => {
    if (error) {
      // console.log(error);
    } else {
      // console.log("response",message.accepted)
      if (message.accepted.length) {
        return true;
      } else {
        return false;
      }
    }
  });
};

// let email = {
//   smtp: {
//     host: "box5826.bluehost.com",
//     port: 587,
//     secure: false,
//     auth: {
//       user: "appadmin@orangecurrent.com",
//       pass: "appadmin@0ct",
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//   },
//   from: "appadmin@orangecurrent.com",
// };
// const transport = nodemailer.createTransport(email.smtp);

let htmlmail =
  ' <a href = "${verification_link}/login/${token}">verification link</a>';

const sendregitserEmail = async (to, name, token) => {
  let subject =
    " Welcome to EEL Online Portal- Please Confirm Your Registration";

  let text = `Dear ${name},</br> 
 
  Thank you for registering with EEL Online portal. We're excited to welcome you to our platform!</br></br>
  
  To complete your registration and unlock the full potential of our services, please verify your email address by clicking the link below:</br></br>
  
  ${htmlmail}</br></br>
  
  If you are unable to click the link, please copy and paste the following URL into your web browser's address bar.</br></br>
   
  Please note that this confirmation link will expire in 48 hours for security reasons. This is an automated message, please do not reply.</br></br> 
  
  If you have any questions or concerns regarding EEL, please do not hesitate to contact our customer support team at enquiries.eel@eel.interior.gov.ng or +234-7080647200.</br></br> 
  
  Thank you,</br> 
  EEL Team`;
  const msg = {
    from: config.email.from,
    to,
    subject,
    text,
  };
  await transport.sendMail(msg);
};

// const sendregitserEmail = async (to, token) => {
//   // let token = "hdfjfdbfdjbdjdj"
//   let subject =
//     " Welcome to EEL Online Portal- Please Confirm Your Registration ";

//   let text = `  Dear comapny,
//     Welcome to the EEL Portal.
//     To complete your registration and gain full access to our platform, please confirm your email address by clicking the link below:<html> <a href = http://194.163.171.206:31234/login/${token}>link</a></html>
//     If you are unable to click the link, please copy and paste the following URL into your web browser's address bar: <html><a href = "http://194.163.171.206:31234/login/${token}">link</a></html>
//     Please note that this confirmation link will expire in 48 hours for security reasons.
//     This is an automated message, please do not reply.
//     If you need additional assistance, please contact enquiries@eel.interior.gov.ng
//     Thank you,
//     EEL Team `;
//   const msg = {
//     from: config.email.from,
//     to,
//     subject,
//     text,
//   };
//   await transport.sendMail(msg);
// };

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = "Reset password";
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://http://localhost:3000/api/v1/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = "Email Verification";
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendContactEmail,
  sendcardEmail,
  sendregitserEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  cardThirtyDaysEmail,
  cardFifteenDaysEmail,
  cardTenDaysEmail,
  cardFiveDaysEmail,
  cardZeroDaysEmail,
};
