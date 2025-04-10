import mongoose, { Schema, Document, Model } from "mongoose";

export interface INode extends Document {
  name: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// Déclaration du modèle avec une valeur par défaut pour éviter les erreurs côté client
let NodeModel: Model<INode> = null as any;

// Vérification si on est côté serveur
if (typeof window === "undefined") {
  const NodeSchema = new Schema<INode>(
    {
      name: { type: String, required: true },
      status: { type: String, required: true, default: "active" },
    },
    { timestamps: true }
  );

  NodeModel = mongoose.models.Node || mongoose.model<INode>("Node", NodeSchema);
}

export default NodeModel;
