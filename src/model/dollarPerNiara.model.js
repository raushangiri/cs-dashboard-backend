const mongoose = require("mongoose");
const convertChargeSchema = new mongoose.Schema(
  {
    nairaRate_perDoller: {
      type: String,
      required: true,
    },
    CTO_id: {
      type: String,
      required: true,
    },
    CTO_email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);
const convertCharge = mongoose.model(
  "doller_conversion_rate",
  convertChargeSchema
);
module.exports = convertCharge;
