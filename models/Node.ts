import mongoose, { Document } from 'mongoose';

export interface INode extends Document {
  pubkey: string;
  alias?: string;
  capacity?: number;
  channelCount?: number;
  firstSeen?: Date;
  updatedAt: Date;
  metrics: {
    feeRate?: number;
    baseFee?: number;
    minHtlc?: number;
    maxHtlc?: number;
    timeLockDelta?: number;
  };
  channels: Array<{
    channelId: string;
    capacity?: number;
    node1Pubkey: string;
    node2Pubkey: string;
    lastUpdate: Date;
    status: string;
  }>;
}

const NodeSchema = new mongoose.Schema({
  pubkey: {
    type: String,
    required: true,
    unique: true,
  },
  alias: String,
  capacity: Number,
  channelCount: Number,
  firstSeen: Date,
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  metrics: {
    feeRate: Number,
    baseFee: Number,
    minHtlc: Number,
    maxHtlc: Number,
    timeLockDelta: Number,
  },
  channels: [{
    channelId: String,
    capacity: Number,
    node1Pubkey: String,
    node2Pubkey: String,
    lastUpdate: Date,
    status: String,
  }],
});

export default mongoose.models.Node || mongoose.model<INode>('Node', NodeSchema); 