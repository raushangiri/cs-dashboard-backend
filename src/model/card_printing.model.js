const mongoose = require("mongoose");
const cardPrintSchema = new mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
    },
    emp_full_name: {
      type: String,
      required: true,
    },
    employee_email: {
      type: String,
      required: true,
    },
    employee_id: {
      type: String,
      required: true,
    },
    company_email: {
      type: String,
      required: true,
    },
    employee_country_code: {
      type: String,
      required: true,
    },
    employee_contact_number: {
      type: String,
      required: true,
    },
    company_country_code: {
      type: String,
      required: true,
    },
    card_number: {
      type: String,
      required: true,
    },
    company_name: {
      type: String,
      required: true,
    },
    company_contact_number: {
      type: String,
      required: true,
    },
    // payment_status_:{}
    request_date: {
      type: String,
      required: true,
    },
    request_status: {
      type: String,
      enum: [
        "PENDING",
        "INITIATED",
        "PRINTING",
        "SHIPPING",
        "DISPATCH",
        "DELIVERED",
      ],
      default: "PENDING",
    },
    print_status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    dispatch_status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    printing_agent_id: {
      type: String,
      // required: true,
    },
    courier_name: {
      type: String,
      // required: true,
    },
    trackid: {
      type: String,
      // required: true,
    },
    printing_allocation_date: {
      type: String,
      //   required: true,
    },
    dispatching_agent_id: {
      type: String,
      // required: true,
    },
    dispatch_allocation_date: {
      type: String,
      //   required: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);
const cardprint = mongoose.model("card_printing_requests", cardPrintSchema);
module.exports = cardprint;
