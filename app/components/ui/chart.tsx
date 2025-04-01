"use client";

// Note: Ce composant est un conteneur pour Chart.js.
// L'implémentation réelle de Chart.js nécessiterait l'installation du package react-chartjs-2.

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface ChartProps {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  height?: number;
}

export const Chart = ({
  children,
  title,
  description,
  height = 300,
}: ChartProps) => {
  return (
    <Card>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="p-4" style={{ height: `${height}px` }}>
        {children}
      </CardContent>
    </Card>
  );
};

// Exemple d'utilisation avec react-chartjs-2:
//
// import { Chart as ChartJS, ... } from 'chart.js';
// import { Line } from 'react-chartjs-2';
//
// export function LineChart({ data, options, ...props }) {
//   return (
//     <Chart {...props}>
//       <Line data={data} options={options} />
//     </Chart>
//   );
// }
