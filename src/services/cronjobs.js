const cron = require("node-cron");
const { email } = require("./src/config/config");

// Define the cron schedule (e.g., every 15 days on the 1st and 16th of the month)
const cronExpression = "0 0 1,16 * *"; // This runs on the 1st and 16th day of each month

// Define the task to run
// const task = async () => {
//   const emp = await employeeCard.find({}, { card_expiry_date: 1 }).lean();
//   counter = 0;
//   let fifteendays = emp.forEach((i) => {
//     // console.log(i.card_expiry_date, counter++);

//     let days = moment() - i.card_expiry_date;
//     // console.log(moment());
//     // console.log(days);
//     // console.log("This cron job runs every 15 days.");

//     // if (emp.card_expiry_date === moment()) {
//     //   console.log(day);
//     //   // send email
//     // }
//   });

//   // Replace this with your actual task logic
// };
// task();
// Schedule the cron job
// cron.schedule(cronExpression, task, {
//   scheduled: true, // Start the cron job immediately
//   timezone: "your-timezone-here", // Replace with your timezone
// });
const {
  EVERY_30_SECONDS,
  EVERY_HOUR,
  EVERY_MINUTE,
  EVERY_30_MINUTES,
} = require("./crontab");
const thirt_sec = () => {
  cron.schedule(EVERY_30_SECONDS, () => {
    // We'll do some work here...
    // generateReport("thirty-seconds");
    console.log("thorty seconds");
  });
};
//   cron.schedule(EVERY_MINUTE, () => {
//     generateReport("minute");
//   });

//   cron.schedule(EVERY_30_MINUTES, () => {
//     generateReport("thirty-minutes");
//   });

//   cron.schedule(EVERY_HOUR, () => {
//     generateReport("hour");
//   });
// };

module.exports = { thirt_sec };
