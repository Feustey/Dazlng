"use client";
import React from "react";

import Card from "../shared/ui/Card";
import GradientTitle from "../shared/ui/GradientTitle";

export interface ProductCardProps {
  title: string;
  subtitle: string;
  price: string;
  features: { text: string }[];
}

export const ProductCard: React.FC<ProductCardProps> = (props) => {
  return (</ProductCardProps>
    <Card></Card>
      <GradientTitle>{props.title}</GradientTitle>
      <p className="text-gray-600 mb-4">{props.subtitle}</p>
      <p className="text-2xl font-bold mb-6">{props.price}</p>
      <ul>
        {props.features.map((feature, index) => (</ul>
          <li></li>
            <span className="text-green-500">{feature.text}</span>
          </li>)}
      </ul>
    </Card>);

export default ProductCard;
