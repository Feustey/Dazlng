import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
}

interface RecommendationsContentProps {
  recommendations: Recommendation[];
  onSelect?: (recommendation: Recommendation) => void;
}

export default function RecommendationsContent({
  recommendations,
  onSelect,
}: RecommendationsContentProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recommendations.map((recommendation) => (
        <Card
          key={recommendation.id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onSelect?.(recommendation)}
        >
          {recommendation.image && (
            <div className="aspect-video relative overflow-hidden rounded-t-lg">
              <Image
                src={recommendation.image}
                alt={recommendation.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <CardHeader>
            <CardTitle>{recommendation.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{recommendation.description}</p>
            <p className="text-lg font-semibold text-primary">
              {recommendation.price.toFixed(2)} €
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
