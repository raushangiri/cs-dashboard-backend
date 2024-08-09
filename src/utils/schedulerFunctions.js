// // const moment = require("moment");
// const card = require("../model/card.model");
// const emailservices = require("../services/email.service");
// const employee = require("../model/employee.model");
// const company = require("../model/company.model");
// const payment = require("../model/payment.model");
// const user = require("../model/user.model");
// const CryptoJS = require("crypto-js");
// const { ObjectId } = require("mongodb");
// const { response } = require("express");
// const generateUniqueAlphanumeric = require("../api/payment/payment.service");
// function convertStringToDate(dateString) {
//   const [day, month, year] = dateString.split("/");
//   return new Date(`${year}-${month}-${day}`);
// }

// function convertStringToDate(dateString) {
//   const [day, month, year] = dateString.split("/");
//   return new Date(`${year}-${month}-${day}`);
// }

// const apikey = process.env.REMITA_API_KEY;
// const merchantId = process.env.REMITA_MERCHANT_ID;

// const moment = require("moment");

// const sucessfulrrr = async () => {
//   const getrrr = await payment.find({ status: "pending" }).lean();
//   // console.log(getrrr, "getrrr");

//   let rrrData = [];
//   // for (let r = 0; r < getrrr.length; r++) {

//   //   let apiHash = CryptoJS.SHA512(
//   //     getrrr[r].rrr + apikey + merchantId
//   //   ).toString();
//   let apiHash = CryptoJS.SHA512(
//     "281055464772" + apikey + merchantId
//   ).toString();

//   // console.log(getrrr[r], "apihash");
//   var myHeaders = new Headers();
//   myHeaders.append("Content-Type", "application/json");
//   myHeaders.append(
//     "Authorization",
//     `remitaConsumerKey=${merchantId},remitaConsumerToken=${apiHash}`
//   );
//   let requestOptions = {
//     method: "GET",
//     headers: myHeaders,
//     redirect: "follow",
//   };
//   // console.log(getrrr[r], "r");
//   //   const apiUrl = `https://login.remita.net/remita/exapp/api/v1/send/api/echannelsvc/${merchantId}/${getrrr[r].rrr}/${apiHash}/status.reg`;
//   //   console.log("inapihash");
//   const apiUrl = `https://login.remita.net/remita/exapp/api/v1/send/api/echannelsvc/${merchantId}/281055464772/${apiHash}/status.reg`;

//   //   try {
//   // console.log("in try");
//   let response = await fetch(apiUrl, requestOptions);
//   if (!response.ok) {
//     console.log("inapihash12");
//     return new Error("Network response was not ok");
//   }
//   // console.log(getrrr[r], "inrrr");
//   console.log("inapihas22h");
//   let resultData = await response.json();
//   console.log(resultData.message, typeof resultData.RRR, "result");
//   if (
//     resultData.message === "Successful" &&
//     "281055464772" === resultData.RRR
//   ) {
//     //   console.log("inapihash1");
//     //   console.log(resultData, "resultData");
//     successfullpayment(resultData);
//     rrrData.push(resultData);
//   }
//   //   } catch (err) {
//   //     console.log(err);
//   //   }
//   // }
//   return rrrData;
// };

// async function handleSuccessfulRrr() {
//   try {
//     const result = await sucessfulrrr();
//     console.log("Successful Transactions:", result);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

// async function successfullpayment(resultData) {
//   try {
//     // let datas = {...data}
//     // console.log(resultData, "resultdatas");
//     let paymentrrr = await payment.findOne({ rrr: resultData.RRR }).lean();
//     console.log(paymentrrr, "paymentrrr");
//     const employeeIds = paymentrrr.employees.map(
//       (employee) => employee.employee_id
//     );
//     console.log(paymentrrr.registration_Object_id);
//     if (paymentrrr.registration_Object_id) {
//       const employeeData = await employee
//         .find({ userid: paymentrrr.registration_Object_id })
//         .lean();
//       console.log(employeeData, "employeeData");

//       const objectIdsToFind = employeeData.reduce((acc, para) => {
//         employeeIds.map((i) => {
//           if (i === para._id.toString()) {
//             acc.push(para);
//           }
//         });
//         return acc;
//       });

//       const comapnyData = await company
//         .findOne({ userid: paymentrrr.registration_Object_id })
//         .lean();
//       console.log(comapnyData, "companyData");

//       await payment.updateMany(
//         { rrr: resultData.RRR },
//         {
//           $set: {
//             status: "success",
//           },
//         }
//       );
//       // // console.log("in1");
//       const employeePayment = await employee.updateMany(
//         { _id: { $in: employeeIds } },
//         {
//           $set: {
//             paymentstatus: "complete",
//           },
//         }
//       );
//       console.log("in2");
//       // console.log(objectIdsToFind, "ectids");

//       const oneYearFromNow = moment().add(1, "years").toDate();
//       const cardObjects = objectIdsToFind.map((findemployee) => {
//         console.log(findemployee, "findemployee");
//         const quotaExpiryDate = convertStringToDate(findemployee.quota_expiry);
//         const cardExpiryDate =
//           quotaExpiryDate > oneYearFromNow
//             ? moment(oneYearFromNow).add(1, "days").format("DD/MM/YYYY")
//             : moment(quotaExpiryDate).format("DD/MM/YYYY");
//         let cardObj = {
//           registration_Object_id: findemployee.userid,
//           emp_registration_id: findemployee._id.toString(),
//           company_name: findemployee.comapnyname,
//           card_issue_date: "15/03/2024",
//           card_expiry_date: cardExpiryDate,
//           quota_expiry_date: findemployee.quota_expiry,
//           mereg_no: findemployee.mereg_no,
//           card_number: generateUniqueAlphanumeric(),
//           card_holder_name: `${findemployee.givenname} ${findemployee.surname}`,
//           designation: findemployee.designation,
//           nationality: findemployee.nationality,
//           emp_profile_photo: findemployee.employee_profile_photo,
//           passport_number: findemployee.passportnumber,
//           cerpac_number: findemployee.cerpac_number,
//           cerpac_validity: findemployee.cerpac_expiry,
//           passport_validaity: findemployee.passportexpiry,
//         };
//         emailservices.sendcardEmail(
//           findemployee.empemail,
//           comapnyData.comapnyName,
//           findemployee.givenname
//         );
//         emailservices.sendcardEmail(
//           comapnyData.businessEmail,
//           comapnyData.comapnyName,
//           findemployee.givenname
//         );
//         console.log(cardObj, "cardObj");
//         return cardObj;
//       });
//       const data = await card.create(cardObjects);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

// module.exports = handleSuccessfulRrr;
