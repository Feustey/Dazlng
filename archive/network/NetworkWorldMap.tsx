import * as React from "react";
import Card from "./ui/card";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { NetworkNode } from "../types/network";
import { useEffect, useRef } from "react";
import { select, Selection } from "d3-selection";
import { geoMercator, geoPath, GeoProjection } from "d3-geo";
import { Feature, GeometryCollection, GeoJsonProperties } from "geojson";

interface NetworkWorldMapProps {
  nodes: NetworkNode[];
}

interface GeoNode extends NetworkNode {
  longitude: number;
  latitude: number;
}

export function NetworkWorldMap({ nodes }: NetworkWorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const svgSelection =
    useRef<Selection<SVGSVGElement | null, unknown, null, undefined>>();

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    // Nettoyer le SVG existant
    select(svgRef.current).selectAll("*").remove();

    // Dimensions du SVG
    const width = 800;
    const height = 400;

    // Créer la projection de la carte mondiale
    const projection = geoMercator()
      .scale(120)
      .center([0, 20])
      .translate([width / 2, height / 2]);

    // Créer le générateur de chemins
    const path = geoPath().projection(projection);

    // Créer le SVG
    svgSelection.current = select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Charger les données géographiques du monde
    fetch("https://unpkg.com/world-atlas@2.0.2/countries-110m.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: Feature<GeometryCollection, GeoJsonProperties>) => {
        if (!data || !svgSelection.current) return;

        // Dessiner les pays
        svgSelection.current
          .append("g")
          .selectAll("path")
          .data([data])
          .enter()
          .append("path")
          .attr("d", path)
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
        const nodeGroups = svgSelection.current
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
      })
      .catch((error) => {
        console.error(
          "Erreur lors du chargement des données géographiques:",
          error
        );
      });

    // Cleanup function
    return () => {
      if (svgSelection.current) {
        svgSelection.current.selectAll("*").remove();
      }
    };
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
