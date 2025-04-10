import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { NetworkNode } from "../types/network";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Feature, GeometryCollection } from "geojson";

interface NetworkWorldMapProps {
  nodes: NetworkNode[];
}

interface GeoNode extends NetworkNode {
  longitude: number;
  latitude: number;
}

export function NetworkWorldMap({ nodes }: NetworkWorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    // Nettoyer le SVG existant
    d3.select(svgRef.current).selectAll("*").remove();

    // Dimensions du SVG
    const width = 800;
    const height = 400;

    // Créer la projection de la carte mondiale
    const projection = d3
      .geoMercator()
      .scale(120)
      .center([0, 20])
      .translate([width / 2, height / 2]);

    // Créer le générateur de chemins
    const path = d3.geoPath().projection(projection);

    // Créer le SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Charger les données géographiques du monde
    d3.json<Feature<GeometryCollection>>(
      "https://unpkg.com/world-atlas@2.0.2/countries-110m.json"
    ).then((data) => {
      if (!data) return;

      // Dessiner les pays
      svg
        .append("g")
        .selectAll("path")
        .data([data])
        .enter()
        .append("path")
        .attr("d", path as any)
        .attr("fill", "#e5e7eb")
        .attr("stroke", "#d1d5db")
        .attr("stroke-width", 0.5);

      // Filtrer les nœuds avec des coordonnées valides
      const validNodes = nodes.filter(
        (node): node is GeoNode =>
          "longitude" in node &&
          "latitude" in node &&
          typeof node.longitude === "number" &&
          typeof node.latitude === "number"
      );

      // Ajouter les points pour les nœuds
      const nodeGroups = svg
        .append("g")
        .selectAll("g")
        .data(validNodes)
        .enter()
        .append("g")
        .attr("transform", (d: GeoNode) => {
          const coords = projection([d.longitude, d.latitude]);
          if (!coords) return "translate(0,0)";
          return `translate(${coords[0]},${coords[1]})`;
        });

      // Ajouter les cercles pour les nœuds
      nodeGroups
        .append("circle")
        .attr("r", (d: GeoNode) => Math.log10(d.capacity / 100000000 + 1) * 2)
        .attr("fill", "#3b82f6")
        .attr("opacity", 0.6)
        .attr("stroke", "#2563eb")
        .attr("stroke-width", 1);

      // Ajouter les tooltips
      nodeGroups
        .append("title")
        .text(
          (d: GeoNode) =>
            `${d.alias || d.publicKey.substring(0, 8)}...\nCapacité: ${(d.capacity / 100000000).toFixed(2)} BTC`
        );
    });
  }, [nodes]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribution géographique des nœuds</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <svg ref={svgRef} className="mx-auto"></svg>
        </div>
      </CardContent>
    </Card>
  );
}
