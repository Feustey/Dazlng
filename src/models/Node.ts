import mongoose from 'mongoose';

export interface INode {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const nodeSchema = new mongoose.Schema<INode>({
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Node = mongoose.models.Node || mongoose.model<INode>('Node', nodeSchema);

export default Node; 