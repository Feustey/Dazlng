import mongoose from "mongoose";

const networkSummarySchema = new mongoose.Schema({
  total_nodes: Number,
  active_nodes: Number,
  total_channels: Number,
  active_channels: Number,
  total_capacity: Number,
  avg_capacity: Number,
  avg_fee_rate: Number,
  avg_base_fee: Number,
  network_growth: {
    nodes: Number,
    channels: Number,
    capacity: Number,
  },
  top_nodes: [
    {
      pubkey: String,
      alias: String,
      capacity: Number,
      channels: Number,
    },
  ],
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.NetworkSummary ||
  mongoose.model("NetworkSummary", networkSummarySchema);
