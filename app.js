const { config } = require("dotenv");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cron = require("node-cron");
const helmet = require("helmet");
const cluster = require("cluster");
const os = require("os");
const numCPUs = require("node:os").availableParallelism();
const quota = require("./src/model/quota.model");
const process = require("node:process");
const router = require("./src/api/route/routes");
const handleSuccessfulRrr = require("./src/utils/schedulerFunctions");

require("dotenv").config();
const port = process.env.port;
let cpuCount = os.cpus().length;
// const croncb = require("./src/services/cronjobs");
// croncb();
const email_link = process.env.verified_uri;

const { connectDB, disconnectDB } = require("./src/db/connection");
// connectDB();

connectDB(function (err, db) {
  if (err) {
    // Handle error
    console.error("Error occurred while connecting to MongoDB", err);
    return;
  }

  // Perform operations using the db object
  const collection = db.collection("documents");
  collection.insertOne({ a: 1 }, function (err, result) {
    if (err) {
      console.error("Error occurred while inserting document", err);
      disconnectDB(function (disconnectErr) {
        if (disconnectErr) {
          console.error(
            "Error occurred while disconnecting from MongoDB",
            disconnectErr
          );
        }
      });
      return;
    }
    // console.log("Document inserted successfully");

    // Disconnect from the database after operation is completed
    disconnectDB(function (disconnectErr) {
      if (disconnectErr) {
        console.error(
          "Error occurred while disconnecting from MongoDB",
          disconnectErr
        );
      }
    });
  });
});
const {
  sendthirtydayemail,
  paymentstatus,
} = require("./src/utils/employeenotification");
function startexpress() {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  var corsOptions = {
    origin: "http://example.com",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
  // console.log("here");
  // router
  app.use("/", router);
  // app.use(helmet());
  // app.use(
  //   helmet({
  //     xFrameOptions: { action: "deny" },
  //   })
  // );
  app.use(
    helmet.frameguard({
      action: "deny",
    })
  );

  // console.log(email_link, "email_link");
  app.get("/welcome", (req, res) => {
    res.status(200).send({ message: "the server is running" });
  });

  app.get("/healthcheck", (req, res) => {
    res.status(200).send({ message: "ok", status: 200 });
  });

  // cron.schedule("*/30 * * * * *", async () => {
  //   // await emailservices.sendcardEmail(i.empemail, i.givenname);
  //   await handleSuccessfulRrr();
  //   console.log("30 seconds");
  // });

  // cron.schedule("0 0 * * *", async () => {
  //   // await emailservices.sendcardEmail(i.empemail, i.givenname);
  //   // await paymentstatus();
  //   await sucessfulrrr();
  //   console.log("12 o clock every day");
  // });
  // sucessfulrrr();

  // cron.schedule("*/10 * * * * *", async () => {
  //   // await emailservices.sendcardEmail(i.empemail, i.givenname);
  //   await sendthirtydayemail();
  //   console.log("thorty seconds");
  // });

  // cron.schedule("*/30 * * * * *", async () => {
  //   await emailservices.sendcardEmail(i.empemail, i.givenname);
  //   console.log("thorty seconds");
  // });

  // cron.schedule("*/30 * * * * *", async () => {
  //   await emailservices.sendcardEmail(i.empemail, i.givenname);
  //   console.log("thorty seconds");
  // });

  // cron.schedule("*/30 * * * * *", async () => {
  //   await emailservices.sendcardEmail(i.empemail, i.givenname);
  //   console.log("thorty seconds");
  // });

  // cron.schedule("*/30 * * * * *", async () => {
  //   await emailservices.sendcardEmail(i.empemail, i.givenname);
  //   console.log("thorty seconds");
  // });

  app.listen(port, console.log("server is running at ", port));
  // disconnectDB();
}

//remove comment from here
// if (cluster.isMaster) {
//   masterProcess();
//   // } else {
//   //   childProcess();
// }

// function masterProcess() {
//   console.log(`Master ${process.pid} is running`);

//   for (let i = 0; i < cpuCount; i++) {
//     console.log(`Forking process number ${i}...yo`);
//     cluster.fork();
// }
// }

// function childProcess() {
//   console.log(`Worker ${process.pid} started and finished`);

//   process.exit();
// }

// \another way of clustering
if (cluster.isPrimary) {
  console.log(`Number of CPUs is ${cpuCount}`);
  console.log(`Primary ${process.pid} is running`);
  for (var i = 0; i < cpuCount; i++) {
    cluster.fork();
  }

  cluster.on("online", function (worker) {
    console.log("Worker " + worker.process.pid + " is online");
  });

  cluster.on("exit", function (worker, code, signal) {
    console.log(
      "Worker " +
        worker.process.pid +
        " died with code: " +
        code +
        ", and signal: " +
        signal
    );
    console.log("Starting a new worker");
    cluster.fork();
  });
} else {
  startexpress();
}
// app.listen(port, console.log("server is running at ", port));
