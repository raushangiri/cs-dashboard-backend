const mongoose = require("mongoose");

const auxChangeSchema = new mongoose.Schema({
  aux: {
    type: String,
    enum: ["Meeting", "Break", "Available", "Training", "Offline"],
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    default: null, // Will be filled when user changes AUX again
  },
});

const dailyAuxSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  auxChanges: [auxChangeSchema],
});

dailyAuxSchema.index({ userId: 1, date: 1 }, { unique: true });

const DailyAux = mongoose.model("Userauxdata", dailyAuxSchema);

module.exports = DailyAux;
