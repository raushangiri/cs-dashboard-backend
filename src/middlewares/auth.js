const jwt = require("jsonwebtoken");
require("dotenv").config();
const fs = require("fs");

// import { Request, Response, NextFunction } from 'express';
// import { verify, JwtPayload } from 'jsonwebtoken';
// import config from '../config';

// The CustomRequest interface enables us to provide JWTs to our controllers.
// export interface CustomRequest extends Request {
//     token: JwtPayload;
// }
const jwtsecretkey = process.env.secretkey;

// const checkJwt = (req,res,next) => {
//     // Get the JWT from the request header.
//     const token = req.headers['authorization'];
//     let jwtPayload;

//     // Validate the token and retrieve its data.
//     try {
//         // Verify the payload fields.
//         jwtPayload = verify(token?.split(' ')[1], jwtsecretkey, {
//             complete: true,
//             audience: config.jwt.audience,
//             issuer: config.jwt.issuer,
//             algorithms: ['HS256'],
//             clockTolerance: 0,
//             ignoreExpiration: false,
//             ignoreNotBefore: false
//         });
//         // Add the payload to the request so controllers may access it.
//         req.token = jwtPayload;
//     } catch (error) {
//         res.status(401)
//             .type('json')
//             .send(JSON.stringify({ message: 'Missing or invalid token' }));
//         return;
//     }

//     // Pass programmatic flow to the next middleware/controller.
//     next();
// };

// module.exports = checkJwt

// const verifyToken = (req, res, next) => {
//   const accessToken =
//     req.body.accessToken || req.query.accessToken || req.headers["x-access-accessToken"];
//   if (!accessToken) {
//     return res.status(403).send("A accessToken is required for authentication");
//   }
//   try {
//     const decoded = jwt.verify(accessToken, jwtsecretkey);
//     req.user = decoded;
//   } catch (err) {
//     return res.status(401).send("Invalid accessToken");
//   }
//   return next();
// };

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log(req.headers);
  if (!authHeader) {
    res.status(401).json({
      status: "fail",
      message: "Unauthorized!",
    });
  }
  // console.log("authHeader");

  const token = authHeader.split(" ")[1];
  // console.log(token);

  const decodeteokn = jwt.decode(token);
  // console.log(decodeteokn, "decode");
  let i = "Mysoft corp"; // Issuer
  let s = "some@user.com"; // Subject
  let a = "http://mysoftcorp.in";
  var verifyOptions = {
    // issuer: i,
    // subject: s,
    // audience: a,
    expiresIn: "24h",
    // algorithm: "RS1024",
  };

  try {
    // console.log("intry");
    // console.log(process.env.secretkey, "secret");
    // var publicKEY = fs.readFileSync("./public.key", "utf8");
    // const publicKey = fs.readFileSync("public.key", "utf8");

    // // console.log(publicKEY, "publicKEY");
    // var privateKEY = fs.readFileSync("./private.key", "utf8");

    const user = jwt.verify(token, jwtsecretkey, verifyOptions);
    // const user = jwt.verify(token, privateKEY, verifyOptions);
    // const user = jwt.verify(token, publicKey, { algorithms: ["RS256"] });

    // console.log("\nJWT verification result: " + JSON.stringify(user));
    // console.log(user, "user");
    req.user = user;
    next();
  } catch (error) {
    // console.log(error.message, "unauthorized user");
    res.status(401).json({
      status: "fail",
      message: "Unauthorized!",
    });
  }
};

// const publicKey = fs.readFileSync("public.key", "utf8");
// try {
//   const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });
//   console.log("Decoded JWT:", decoded);
// } catch (error) {
//   console.error("JWT verification failed:", error.message);
// }

module.exports = verifyToken;
