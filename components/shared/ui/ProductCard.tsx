import React from "react";
import Card from "./Card";
import GradientTitle from "./GradientTitle";

export interface Feature {
  text: string;
}

export interface ProductCardProps {
  title: string;
  subtitle: string;
  price: string;
  features: Feature[];
  bonusFeatures?: Feature[];
}

const ProductCard: React.FC<ProductCardProps> = ({title, subtitle, price, features, bonusFeatures}) => {
  return (</ProductCardProps>
    <Card></Card>
      <GradientTitle>{title}</GradientTitle>
      <p className="text-gray-600 mb-4">{subtitle}</p>
      <div>
        {price}</div>
      </div>
      <ul>
        {features.map((feature: any index: any) => (</ul>
          <li></li>
            <span className="text-green-500">{feature.text}</span>
          </li>)}
      </ul>
      {bonusFeatures && (
        <div></div>
          <span className="font-bold mb-2 text-[#C026D3] block text-center">{t("ProductCard.bonus_inclus_")}</span>
          {bonusFeatures.map((feature: any index: any) => (<span key={index} className="mb-1 text-gray-700 text-sm block text-center">{feature.text}</span>)}
        </div>
      )}
    </Card>);;

export default ProductCard; 