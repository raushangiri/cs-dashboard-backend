const { config } = require("dotenv");
const punycode = require('punycode/');
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cron = require("node-cron");
const helmet = require("helmet");
const cluster = require("cluster");
const os = require("os");
const numCPUs = require("node:os").availableParallelism();
const process = require("node:process");
const router = require("./src/api/route/routes");
require("dotenv").config();
const mongoose = require('mongoose');
const fs = require('fs');

const overview_details = require('./src/model/overview.model');  // Your model
const loanfilemodel = require('./src/model/loan_file.model');

const port = process.env.port;








let cpuCount = os.cpus().length;
const email_link = process.env.verified_uri;
const { connectDB, disconnectDB } = require("./src/db/connection");
connectDB(function (err, db) {
  if (err) {
   
    console.error("Error occurred while connecting to MongoDB", err);
    return;
  }

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
function startexpress() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));
  app.use(cors());
  // app.use(cors({
  //   origin: ['https://customer-management-admin.netlify.app','http://localhost:3000','http://82.180.147.224:3000/'], // Replace with your frontend URL
  //   methods: ['GET', 'POST', 'PUT', 'DELETE'],
  //   credentials: true, // If you need cookies or authorization headers to be sent
  // }));
  app.use(express.urlencoded({ limit: '2mb', extended: true }));

  var corsOptions = {
    origin: "http://example.com",
    optionsSuccessStatus: 200, 
  };
  app.use("/", router);
  app.use(
    helmet.frameguard({
      action: "deny",
    })
  );


  const multer = require('multer');
  const csvParser = require('csv-parser'); // If you're parsing CSVs
  
  // Set up multer to handle file uploads
  const upload = multer({ dest: 'uploads/' }); // 'uploads/' is the directory where files will be temporarily stored
  
  // Route to handle file uploads
  app.post('/upload', upload.single('file'), async (req, res) => {
   
      const session = await mongoose.startSession();
      try {
        session.startTransaction();
    
        const file = req.file;
        const batchSize = 200;
    
        if (!file) {
          return res.status(400).json({ message: 'No file uploaded.' });
        }
    
        const data = [];
        fs.createReadStream(file.path)
          .pipe(csvParser())
          .on('data', (row) => {
            data.push(row);
          })
          .on('end', async () => {
            const totalBatches = Math.ceil(data.length / batchSize);
            console.log(`Processing ${totalBatches} batches of size ${batchSize}`);
    
            for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
              const batch = data.slice(batchIndex * batchSize, (batchIndex + 1) * batchSize);
    
            const overviewDocs = [];
            const fileStatusDocs = [];
  
            for (let item of batch) {
              if (item["Customer Name"] && item["Customer Number"]) {
                const fileNumber = await generateFileNumber(); // Unique file number generator
  
                const overviewDoc = {
                  file_number: fileNumber,
                  mobile_number: item["Customer Number"],
                  previous_loan_bank_name: item["Bank Name"],
                  previous_product_model: item["Product Name"],
                  previous_loan_sanction_date: item["Loan Sanction Date"],
                  customer_name: item["Customer Name"],
                  previous_loan_type: item["Loan Type"],
                  previous_loan_amount: item["Loan Amount"],
                  previous_loan_insurance_value: item["Loan Insurance Value"],
                  previous_loan_insurance_bank_name: item["Loan Insurance Bank Name"],
                  permanentAddress: item["Permanent address"],
                  location: item["Location"],
                  city: item["City"],
                  companyName: item["Company Name"],
                  salary: item["Salary"],
                  selfEmployee: item["Self Employee"],
                  companyNumber: item["Company Number"],
                  companyAddress: item["Company Address"],
                  emailId: item["Email Id"],
                  tenure: item["tenure"],
                  carName: item["Car Name"],
                  carDetails: item["Car Details"],
                  model: item["Modal"],
                  carNumber: item["Car Number"],
                };
  
                const fileStatusDoc = {
                  file_number: fileNumber,
                  customer_name: item["Customer Name"],
                  customer_mobile_number: item["Customer Number"],
                };
  
                overviewDocs.push(overviewDoc);
                fileStatusDocs.push(fileStatusDoc);
              }
            }
  
            console.log(`Inserting batch ${batchIndex + 1} of ${totalBatches}...`);
  
            await overview_details.insertMany(overviewDocs, { session });
            await loanfilemodel.insertMany(fileStatusDocs, { session });
          }
  
          await session.commitTransaction();
          session.endSession();
  
          res.status(200).json({ message: 'Data stored successfully!' });
        });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ message: 'Failed to store data.', error });
    }
  });
  




  app.get("/welcome", (req, res) => {
    res.status(200).send({ message: "the server is running" });
  });

  app.get("/healthcheck", (req, res) => {
    res.status(200).send({ message: "ok", status: 200 });
  });

  app.listen(port, console.log("server is running at ", port));
}


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

