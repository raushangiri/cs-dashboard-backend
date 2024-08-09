// const user = require("../../model/user.model")
let user = {};
const hashpaswword = require("./passwordHash");
const nodemailer = require("nodemailer");
const createUser = async (userbody) => {
  // console.log(userbody, "inservice");
  const userDetails = await user.find({
    businessEmail: userbody.businessEmail,
  });
  // console.log(userDetails);
  const password = hashpaswword(userbody.password);
  if (userbody.length) {
    // const token = jwt.sign(
    //     { user_id: user._id, email },
    //     process.env.TOKEN_KEY,
    //     {
    //       expiresIn: "2h",
    //     }
    //   );
    //   userbody.token = token

    // console.log(userbody);
    userbody.password = password;
    // console.log(userbody);
    const userCreated = await user.create(userbody);
    return userCreated;
  }
};

const matches = (obj1, obj2) => {
  let matchdata = [];
  for (let key in obj1) {
    if (key in obj2) {
      matchdata.push(obj2[key]);
    }
  }
  // console.log(matchdata);
  const result = matchdata.every((i) => {
    return Object.values(obj1).includes(i);
  });
  return result;
};

// const sendEmail = async (to, subject, text) => {
//   const transportOptions = {
//     host: "smtp.office365.com",
//     port: "587",
//     auth: { user: ": contactus@eelnigeria.com.ng", pass: "Taf55155" },
//     secureConnection: true,
//     tls: { ciphers: "SSLv3" },
//   };

//   const mailTransport = nodemailer.createTransport(transportOptions);

//   await mailTransport.sendMail({
//     // from,
//     to,
//     // replyTo: from,
//     subject,
//     // html,
//     text,
//   });
// };
module.exports = {
  createUser,
  matches,
};
