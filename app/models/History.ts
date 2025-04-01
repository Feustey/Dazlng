import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  price: { type: Number, required: true },
  volume: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Index pour les requêtes fréquentes
historySchema.index({ date: 1 });
historySchema.index({ timestamp: -1 });

const History = mongoose.models.History || mongoose.model('History', historySchema);

export interface IHistory {
  _id?: string;
  date: Date;
  price: number;
  volume: number;
  timestamp: Date;
}

export default History; 