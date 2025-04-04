import mongoose from "mongoose";

const centralityDataSchema = new mongoose.Schema({
  betweenness: Number,
  closeness: Number,
  eigenvector: Number,
  alias: String,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.CentralityData ||
  mongoose.model("CentralityData", centralityDataSchema);
