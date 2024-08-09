// const moment = require("moment");
// const card = require("../model/card.model");
// const emailservices = require("../services/email.service");
// const employee = require("../model/employee.model");
// const company = require("../model/company.model");
// const payment = require("../model/payment.model");
// const user = require("../model/user.model");
// const CryptoJS = require("crypto-js");
// const { response } = require("express");
// const generateUniqueAlphanumeric = require("../api/payment/payment.service");
// function convertStringToDate(dateString) {
//   const [day, month, year] = dateString.split("/");
//   return new Date(`${year}-${month}-${day}`);
// }

// const sendthirtydayemail = async () => {
//   let data = await card.find({}).lean();
//   const employeemail = await employee.find({}).lean();
//   let expiredDate = data.map(async (i) => {
//     // let todayDate = moment(new Date()).format("DD/MM/YYYY");
//     let datasDate = moment(i.card_expiry_date);
//     let now = moment();
//     currntDate = new Date();
//     // console.log(now, "currntDate");
//     const expiryDate = convertStringToDate(i.card_expiry_date);
//     // console.log(expiryDate, "ex");
//     const daysDifference = Math.ceil(
//       (expiryDate - now) / (1000 * 60 * 60 * 24)
//     ); // Calculate difference in days
//     // console.log(daysDifference, "dd");
//     // console.log(i.card_expiry_date);
//     // console.log(daysDifference, "todaysdate");
//     if (daysDifference === 30) {
//       employeemail.forEach(async (element) => {
//         if (element._id === i.emp_registration_id) {
//           await emailservices.cardThirtyDaysEmail(
//             element.empemail,
//             i.card_holder_name
//             // "hkethaperaje@gmail.com",
//             // "hrishi"
//           );
//         }
//       });
//     }
//   });
// };

// const sendfifteendayemail = async () => {
//   let data = await card.find({}).lean();
//   const employeemail = await employee.find({}).lean();
//   let expiredDate = data.map(async (i) => {
//     // let todayDate = moment(new Date()).format("DD/MM/YYYY");
//     let datasDate = moment(i.card_expiry_date);
//     let now = moment();
//     currntDate = new Date();
//     // console.log(now, "currntDate");
//     const expiryDate = convertStringToDate(i.card_expiry_date);
//     // console.log(expiryDate, "ex");
//     const daysDifference = Math.ceil(
//       (expiryDate - now) / (1000 * 60 * 60 * 24)
//     ); // Calculate difference in days
//     // console.log(daysDifference, "dd");
//     // console.log(i.card_expiry_date);
//     // console.log(daysDifference, "todaysdate");
//     if (daysDifference === 15) {
//       employeemail.forEach(async (element) => {
//         if (element._id === i.emp_registration_id) {
//           await emailservices.cardThirtyDaysEmail(
//             element.empemail,
//             i.card_holder_name
//             // "hkethaperaje@gmail.com",
//             // "hrishi"
//           );
//         }
//       });
//     }
//   });
// };

// const sendfivedayemail = async () => {
//   let data = await card.find({}).lean();
//   const employeemail = await employee.find({}).lean();
//   let expiredDate = data.map(async (i) => {
//     // let todayDate = moment(new Date()).format("DD/MM/YYYY");
//     let datasDate = moment(i.card_expiry_date);
//     let now = moment();
//     currntDate = new Date();
//     // console.log(now, "currntDate");
//     const expiryDate = convertStringToDate(i.card_expiry_date);
//     // console.log(expiryDate, "ex");
//     const daysDifference = Math.ceil(
//       (expiryDate - now) / (1000 * 60 * 60 * 24)
//     ); // Calculate difference in days
//     // console.log(daysDifference, "dd");
//     // console.log(i.card_expiry_date);
//     // console.log(daysDifference, "todaysdate");
//     if (daysDifference === 10) {
//       employeemail.forEach(async (element) => {
//         if (element._id === i.emp_registration_id) {
//           await emailservices.cardThirtyDaysEmail(
//             element.empemail,
//             i.card_holder_name
//             // "hkethaperaje@gmail.com",
//             // "hrishi"
//           );
//         }
//       });
//     }
//   });
// };

// function convertStringToDate(dateString) {
//   const [day, month, year] = dateString.split("/");
//   return new Date(`${year}-${month}-${day}`);
// }

// const apikey = process.env.REMITA_API_KEY;
// const merchantId = process.env.REMITA_MERCHANT_ID;

// const paymentstatus = async () => {
//   try {
//     const getrrr = await payment.find({ status: "pending" }).lean();
//     console.log(getrrr, "getrrr");
//     // let rrr = "271006901995";
//     let finalrrr = getrrr.filter(async (i) => {
//       let rrrData = [];
//       // console.log(i.rrr);
//       //   console.log(rrr, merchantId, apikey);
//       let apiHash = CryptoJS.SHA512(i.rrr + apikey + merchantId).toString();
//       console.log(apiHash, "apihash");
//       var myHeaders = new Headers();
//       myHeaders.append("Content-Type", "application/json");
//       myHeaders.append(
//         "Authorization",
//         `remitaConsumerKey=${merchantId},remitaConsumerToken=${apiHash}`
//       );

//       let requestOptions = {
//         method: "GET",
//         headers: myHeaders,
//         redirect: "follow",
//       };
//       const apiUrl = `https://login.remita.net/remita/exapp/api/v1/send/api/echannelsvc/${merchantId}/${i.rrr}/${apiHash}/status.reg`;

//       let bhrrr = await fetch(apiUrl, requestOptions)
//         .then(async (response) => {
//           if (!response.ok) {
//             throw new Error("Network response was not ok");
//           }
//           let responseData = await response.json();
//           return responseData;
//         })
//         .then(async (result) => {
//           console.log(result, "result");
//           let resultData = { ...result };
//           if (resultData.message === "Successful" && i.rrr === resultData.RRR) {
//             rrrData.push(resultData);
//             console.log(resultData, "resultdata");
//             // }
//             return i;
//           } // let resultData =
//           // return result.json();
//           // return rrrData;
//         });
//       let allids = rrrData.map((i) => i.RRR);
//       console.log(allids, "allids");
//       if (allids.length > 0) {
//         const updatePayment = await payment
//           .findOne({ rrr: { $in: allids } })
//           .lean();
//         console.log(updatePayment, "upda");
//         if (updatePayment) {
//           let emails = updatePayment.employees.map(
//             (employee) => employee.email
//           );
//           if (emails.length > 0) {
//             const findemployee = await employee
//               .findOne({ empemail: { $in: emails } })
//               .lean();
//             // console.log(findemployee, "employee");
//             let validity = moment().add(1, "years");
//             let oneyear = convertStringToDate(
//               moment().add(1, "years").format("DD/MM/YYYY")
//             );
//             const oneYearAndOneDayAgo = validity
//               .add(-1, "days")
//               .format("DD/MM/YYYY");
//             if (findemployee) {
//               const comapnyData = await company
//                 .findOne({ userid: findemployee.userid })
//                 .lean();
//               await payment.updateMany(
//                 { rrr: { $in: allids } },
//                 {
//                   $set: {
//                     status: "success",
//                   },
//                 }
//               );
//               console.log("in1");
//               const employeePayment = await employee.updateMany(
//                 { empemail: { $in: emails } },
//                 {
//                   $set: {
//                     paymentstatus: "complete",
//                   },
//                 }
//               );
//               console.log("in2");
//               if (convertStringToDate(findemployee.quota_expiry) > oneyear) {
//                 // console.log("in1");
//                 // console.log(i, "i");
//                 let cardObj = {
//                   registration_Object_id: findemployee.userid,
//                   emp_registration_id: findemployee._id.toString(),
//                   company_name: findemployee.comapnyname,
//                   // card_issue_date: moment(new Date()).format("DD/MM/YYYY"),
//                   card_issue_date: "15/03/2024",
//                   card_expiry_date: oneYearAndOneDayAgo,
//                   quota_expiry_date: findemployee.quota_expiry,
//                   mereg_no: findemployee.mereg_no,
//                   card_number: generateUniqueAlphanumeric(),
//                   card_holder_name:
//                     findemployee.givenname + " " + findemployee.surname,
//                   designation: findemployee.designation,
//                   nationality: findemployee.nationality,
//                   emp_profile_photo: findemployee.employee_profile_photo,
//                   passport_number: findemployee.passportnumber,
//                   cerpac_number: findemployee.cerpac_number,
//                   cerpac_validity: findemployee.cerpac_expiry,
//                   passport_validaity: findemployee.passportexpiry,
//                   // card_type: "primary"
//                 };
//                 // emailservices.sendcardEmail(
//                 //   findemployee.empemail,
//                 //   comapnyData.comapnyName,
//                 //   findemployee.givenname
//                 // );
//                 // emailservices.sendcardEmail(
//                 //   comapnyData.businessEmail,
//                 //   comapnyData.comapnyName,
//                 //   findemployee.givenname
//                 // );
//                 // console.log(cardObj, "cardObj");
//                 // created_Card.push(cardObj);
//                 const data = await card.create(cardObj);
//               } else if (
//                 convertStringToDate(findemployee.quota_expiry) < oneyear
//               ) {
//                 // console.log("in21");
//                 let carddata = {
//                   registration_Object_id: findemployee.userid,
//                   emp_registration_id: findemployee._id.toString(),
//                   company_name: findemployee.comapnyname,
//                   // card_issue_date: moment(new Date()).format("DD/MM/YYYY"),
//                   card_issue_date: "15/03/2024",
//                   card_expiry_date: findemployee.quota_expiry,
//                   quota_expiry_date: findemployee.quota_expiry,
//                   mereg_no: findemployee.mereg_no,
//                   card_number: generateUniqueAlphanumeric(),
//                   card_holder_name:
//                     findemployee.givenname + " " + findemployee.surname,
//                   designation: findemployee.designation,
//                   nationality: findemployee.nationality,
//                   emp_profile_photo: findemployee.employee_profile_photo,
//                   passport_number: findemployee.passportnumber,
//                   cerpac_number: findemployee.cerpac_number,
//                   cerpac_validity: findemployee.cerpac_expiry,
//                   passport_validaity: findemployee.passportexpiry,
//                   // card_type: "primary"
//                 };
//                 // created_Card.push(carddata);
//                 // emailservices.sendcardEmail(
//                 //   findemployee.empemail,
//                 //   comapnyData.comapnyName,
//                 //   findemployee.givenname
//                 // );
//                 // emailservices.sendcardEmail(
//                 //   comapnyData.businessEmail,
//                 //   comapnyData.comapnyName,
//                 //   findemployee.givenname
//                 // );
//                 // return carddata;
//                 const data = await card.create(carddata);
//               }
//             }
//           }
//         }
//       }
//       // return bhrrr;
//       // console.log(finalrrr.length, "finalrrr");
//     });
//   } catch (error) {
//     // return res.status(401).send({ message: error.message });
//   }
// };

// async function fetchDataAndProcess(apiUrl, requestOptions) {
//   try {
//     const response = await fetch(apiUrl, requestOptions)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         return response.json();
//       })
//       .then((result) => {
//         // console.log(result, "result");
//         let resultData = JSON.parse(result);
//         // let resultData =
//         // return result.json();

//         return resultData;
//       })
//       .then((data) => {
//         let stringifyresultData = JSON.stringify(data);
//         // if (stringifyresultData.message === "Successful") {
//         // console.log(i.rrr, "resultData");
//         // console.log(stringifyresultData, "resultData");
//         // rrrData.push(stringifyresultData.RRR);
//         return stringifyresultData;
//         // }
//       });
//   } catch (error) {
//     return null;
//     // return res.status(401).send({ message: error.message });
//   }
// }

// module.exports = {
//   sendthirtydayemail,
//   sendfifteendayemail,
//   sendfivedayemail,
//   paymentstatus,
// };
