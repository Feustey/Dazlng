import mongoose from 'mongoose';

export interface IRecommendation {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const recommendationSchema = new mongoose.Schema<IRecommendation>({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Recommendation = mongoose.models.Recommendation || mongoose.model<IRecommendation>('Recommendation', recommendationSchema);

export default Recommendation; 