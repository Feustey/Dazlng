import mongoose from "mongoose";

const historicalDataSchema = new mongoose.Schema({
  timestamp: Date,
  alias: String,
  total_fees: Number,
  total_capacity: Number,
  active_channels: Number,
  total_peers: Number,
  total_volume: Number,
});

export default mongoose.models.HistoricalData ||
  mongoose.model("HistoricalData", historicalDataSchema);
