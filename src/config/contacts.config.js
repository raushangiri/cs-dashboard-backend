const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

let envPath = path.join(__dirname, "../../.env");
if (process.env.NODE_ENV === "development")
  envPath = path.join(__dirname, "../../.env.development");
if (process.env.NODE_ENV === "test")
  envPath = path.join(__dirname, "../../.env.test");

// console.log('Application run on ', process.env.NODE_ENV, ' mode');

// dotenv.config({
//   path: envPath,
// });

// const envVarsSchema = Joi.object()
//   .keys({
//     NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
//     PORT: Joi.number().default(3000),
//     APP_PREFIX: Joi.string().optional(),

//     MONGODB_URL: Joi.string().required().description('Mongo DB url'),

//     JWT_SECRET: Joi.string().required().description('JWT secret key'),
//     JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
//     JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),

//     OTP_API_KEY: Joi.string().required(),
//     OTP_BASE_URL: Joi.string().required(),

//     AWS_ACCESS_KEY_ID: Joi.string().required(),
//     AWS_SECRET_ACCESS_KEY: Joi.string().required(),
//     BUCKET_NAME: Joi.string().required(),
//     REGION: Joi.string().required(),

//     SMTP_HOST: Joi.string().description('server that will send the emails'),
//     SMTP_PORT: Joi.number().description('port to connect to the email server'),
//     SMTP_USERNAME: Joi.string().description('username for email server'),
//     SMTP_PASSWORD: Joi.string().description('password for email server'),
//     EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),

//     REPORTS_KPI_APP: Joi.number().description('constant value of Average power purchase'),

//     MQ_URL: Joi.string().required(),
//     MQ_SERVER_URL: Joi.string().required(),

//     COUCHDB_PROTOCOL: Joi.string().required(),
//     COUCHDB_HOST: Joi.string().required(),
//     COUCHDB_PORT: Joi.number().required(),
//     COUCHDB_USER: Joi.string().required(),
//     COUCHDB_PASSWORD: Joi.string().required(),
//     COUCHDB_DB: Joi.string().required(),

//     DB_USER: Joi.string().required(),
//     DB_PASSWORD: Joi.string().required(),
//     DB_NAME: Joi.string().required(),
//     DB_HOST: Joi.string().optional(),
//     DB_PORT: Joi.number().optional(),
//     DB_DIALECT: Joi.string().optional(),
//     DB_LOGGING: Joi.boolean().optional(),

//     LOG_LEVEL: Joi.string().required(),
//     DIR_NAME: Joi.string().required(),
//   })
//   .unknown();

// const {
//   value: envVars,
//   error
// } = envVarsSchema
//   .prefs({
//     errors: {
//       label: 'key',
//     },
//   })
//   .validate(process.env);

// if (error) {
//   throw new Error(`Config validation error: ${error.message}`);
// }

// console.log(envVars.LOG_LEVEL, ' Log Level Selected');

// SMTP_HOST=box5826.bluehost.com
// SMTP_PORT=587
// IS_SSL=false
// SMTP_USERNAME=appadmin@orangecurrent.com
// SMTP_PASSWORD=appadmin@0ct
// EMAIL_FROM=appadmin@orangecurrent.com

module.exports = {
  //   env: envVars.NODE_ENV,
  //   port: envVars.PORT,
  //   appPrefix: envVars.APP_PREFIX || '',
  //   log: {
  //     level: envVars.LOG_LEVEL,
  //   },
  //   mongoose: {
  //     url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
  //     options: {
  //       useCreateIndex: true,
  //       useNewUrlParser: true,
  //       useUnifiedTopology: true,
  //     },
  //   },
  //   jwt: {
  //     secret: envVars.JWT_SECRET,
  //     accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
  //     refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
  //     resetPasswordExpirationMinutes: 10,
  //   },
  //   otp: {
  //     baseURL: envVars.OTP_BASE_URL,
  //     apikey: envVars.OTP_API_KEY,
  //   },
  //   aws: {
  //     access_key: envVars.AWS_ACCESS_KEY_ID,
  //     secret: envVars.AWS_SECRET_ACCESS_KEY,
  //     bucket_name: envVars.BUCKET_NAME,
  //     region: envVars.REGION,
  //   },

  email: {
    smtp: {
      //   name: "bluehost",
      host: "smtp.office365.com",
      port: 587,
      //   secure: false,
      secureConnection: true,

      // auth: { user: "noreply@eelnigeria.com.ng", pass: "Lap24399" },
      auth: { user: "contactus@eelnigeria.com.ng", pass: "Taf55155" },

      // tls: {
      //   rejectUnauthorized: false
      // }
    },
    // from: "noreply@eelnigeria.com.ng",
    from: "contactus@eelnigeria.com.ng",
  },

  // email: {
  //     smtp: {
  //         host: "box5826.bluehost.com",
  //         port: 587,
  //         secure: false,
  //         auth: {
  //             user: "appadmin@orangecurrent.com",
  //             pass: "appadmin@0ct",
  //         },
  //         // tls: {
  //         //   rejectUnauthorized: false
  //         // }
  //     },
  //     from: "appadmin@orangecurrent.com",
  // },

  //   app: {
  //     report: {
  //       kpi: {
  //         app: `${envVars.REPORTS_KPI_APP}`,
  //       },
  //     },
  //   },
  //   mq: {
  //     url: `${envVars.MQ_URL}`,
  //     serverUrl: `${envVars.MQ_SERVER_URL}`,
  //   },
  //   couchdb: {
  //     protocol: envVars.COUCHDB_PROTOCOL || `http`,
  //     host: envVars.COUCHDB_HOST || `localhost`,
  //     port: envVars.COUCHDB_PORT || 5984,
  //     username: envVars.COUCHDB_USER || `admin`,
  //     password: envVars.COUCHDB_PASSWORD || `admin`,
  //     db: envVars.COUCHDB_DB,
  //   },
  //   db: {
  //     username: envVars.DB_USER,
  //     password: envVars.DB_PASSWORD,
  //     database: envVars.DB_NAME,
  //     host: envVars.DB_HOST,
  //     port: envVars.DB_PORT || 5432,
  //     dialect: envVars.DB_DIALECT || 'postgres',
  //     logging: envVars.DB_LOGGING || undefined ? false : envVars.DB_LOGGING,
  //   },
  //   dailySync: `${envVars.DIR_NAME}`,
};
