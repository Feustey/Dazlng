"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import Card from "./ui/card";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { McpService } from "../lib/mcpService";
import {
  NetworkGraph as NetworkGraphType,
  NetworkGraphNode,
  NetworkGraphEdge,
} from "../types/mcpService";
import { Loader2, ZoomIn, ZoomOut, RotateCw, Download } from "lucide-react";
import Button from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useTranslations } from "next-intl";

// Simuler des données pour le développement
const mockNetworkGraph: NetworkGraphType = {
  nodes: Array.from({ length: 50 }).map((_, i) => ({
    id: `node-${i}`,
    pubkey: `02${i.toString().padStart(64, "0")}`,
    alias: `Node ${i}`,
    color: ["#ff6b6b", "#5f3dc4", "#339af0", "#51cf66", "#fcc419"][
      Math.floor(Math.random() * 5)
    ],
    capacity: Math.random() * 10000000,
    channels: Math.floor(Math.random() * 50) + 1,
    coordinates: [Math.random() * 1000 - 500, Math.random() * 1000 - 500],
    group: Math.floor(Math.random() * 5),
  })),
  edges: Array.from({ length: 150 }).map((_, i) => ({
    id: `edge-${i}`,
    source: `node-${Math.floor(Math.random() * 50)}`,
    target: `node-${Math.floor(Math.random() * 50)}`,
    capacity: Math.random() * 1000000,
    direction: ["bi", "out", "in"][Math.floor(Math.random() * 3)] as
      | "bi"
      | "out"
      | "in",
    status: ["active", "inactive", "pending"][Math.floor(Math.random() * 3)] as
      | "active"
      | "inactive"
      | "pending",
    age: Math.floor(Math.random() * 365),
    fee_rate: Math.floor(Math.random() * 500),
    base_fee: Math.floor(Math.random() * 1000),
  })),
  timestamp: new Date().toISOString(),
  metrics: {
    density: 0.12,
    diameter: 6,
    averagePathLength: 2.8,
    clusteringCoefficient: 0.45,
  },
};

function forceDirectedLayout(
  nodes: NetworkGraphNode[],
  edges: NetworkGraphEdge[]
) {
  // Implémentation simplifiée d'un algorithme de layout force-directed
  // Dans une implémentation réelle, vous utiliseriez D3.js, VivaGraphJS ou une autre bibliothèque

  // Créer une map des nœuds pour un accès rapide
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  // Initialiser les positions aléatoires si elles n'existent pas
  nodes.forEach((node) => {
    if (!node.coordinates) {
      node.coordinates = [
        Math.random() * 1000 - 500,
        Math.random() * 1000 - 500,
      ];
    }
  });

  // Paramètres de l'algorithme
  const iterations = 50;
  const repulsionForce = 200;
  const attractionForce = 0.1;
  const maxDisplacement = 10;

  for (let i = 0; i < iterations; i++) {
    // Réinitialiser les forces
    const forces = new Map(nodes.map((node) => [node.id, { x: 0, y: 0 }]));

    // Calculer les forces de répulsion entre tous les nœuds
    for (let j = 0; j < nodes.length; j++) {
      for (let k = j + 1; k < nodes.length; k++) {
        const node1 = nodes[j];
        const node2 = nodes[k];

        if (node1.coordinates && node2.coordinates) {
          const dx = node1.coordinates[0] - node2.coordinates[0];
          const dy = node1.coordinates[1] - node2.coordinates[1];
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;

          const force = repulsionForce / distance;
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;

          forces.get(node1.id)!.x += fx;
          forces.get(node1.id)!.y += fy;
          forces.get(node2.id)!.x -= fx;
          forces.get(node2.id)!.y -= fy;
        }
      }
    }

    // Calculer les forces d'attraction pour les arêtes
    for (const edge of edges) {
      const source = nodeMap.get(edge.source);
      const target = nodeMap.get(edge.target);

      if (source && target && source.coordinates && target.coordinates) {
        const dx = source.coordinates[0] - target.coordinates[0];
        const dy = source.coordinates[1] - target.coordinates[1];
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;

        const force = distance * attractionForce;
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;

        forces.get(source.id)!.x -= fx;
        forces.get(source.id)!.y -= fy;
        forces.get(target.id)!.x += fx;
        forces.get(target.id)!.y += fy;
      }
    }

    // Appliquer les forces et mettre à jour les positions
    for (const node of nodes) {
      if (node.coordinates) {
        const force = forces.get(node.id)!;
        const displacement = Math.sqrt(force.x * force.x + force.y * force.y);

        if (displacement > maxDisplacement) {
          const scale = maxDisplacement / displacement;
          force.x *= scale;
          force.y *= scale;
        }

        node.coordinates[0] += force.x;
        node.coordinates[1] += force.y;
      }
    }
  }

  return nodes;
}

// Fonction pour dessiner le graphe
function drawGraph(
  canvas: HTMLCanvasElement,
  graph: NetworkGraphType,
  options: {
    nodeSize: number;
    edgeWidth: number;
    highlightNode?: string;
    colorBy: "group" | "capacity" | "channels";
    zoom: number;
    panOffset: { x: number; y: number };
  }
) {
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Effacer le canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Calculer les limites du graphe
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;

  graph.nodes.forEach((node) => {
    if (node.coordinates) {
      minX = Math.min(minX, node.coordinates[0]);
      maxX = Math.max(maxX, node.coordinates[0]);
      minY = Math.min(minY, node.coordinates[1]);
      maxY = Math.max(maxY, node.coordinates[1]);
    }
  });

  const width = maxX - minX || 1000;
  const height = maxY - minY || 1000;

  // Fonction pour mapper les coordonnées du graphe aux coordonnées du canvas
  const mapX = (x: number) =>
    (((x - minX) / width) * 0.9 + 0.05) * canvas.width * options.zoom +
    options.panOffset.x;
  const mapY = (y: number) =>
    (((y - minY) / height) * 0.9 + 0.05) * canvas.height * options.zoom +
    options.panOffset.y;

  // Dessiner les arêtes
  graph.edges.forEach((edge) => {
    const source = graph.nodes.find((n) => n.id === edge.source);
    const target = graph.nodes.find((n) => n.id === edge.target);

    if (source && target && source.coordinates && target.coordinates) {
      ctx.beginPath();
      ctx.moveTo(mapX(source.coordinates[0]), mapY(source.coordinates[1]));
      ctx.lineTo(mapX(target.coordinates[0]), mapY(target.coordinates[1]));

      // Définir le style de l'arête en fonction de son statut
      switch (edge.status) {
        case "active":
          ctx.strokeStyle = "rgba(100, 255, 100, 0.3)";
          break;
        case "inactive":
          ctx.strokeStyle = "rgba(255, 100, 100, 0.3)";
          break;
        case "pending":
          ctx.strokeStyle = "rgba(255, 255, 100, 0.3)";
          break;
        default:
          ctx.strokeStyle = "rgba(150, 150, 150, 0.3)";
      }

      // Épaisseur basée sur la capacité
      const normalizedCapacity = Math.log10(edge.capacity) / 7; // Hypothèse: capacité maximale de 10^7
      ctx.lineWidth = options.edgeWidth * (0.5 + 1.5 * normalizedCapacity);

      ctx.stroke();
    }
  });

  // Dessiner les nœuds
  graph.nodes.forEach((node) => {
    if (node.coordinates) {
      ctx.beginPath();

      // Taille du nœud basée sur le nombre de canaux
      const nodeRadius = options.nodeSize * (1 + Math.log10(node.channels) / 2);

      // Couleur basée sur l'option sélectionnée
      let color = node.color;
      if (options.colorBy === "capacity") {
        const capacityScale = Math.log10(node.capacity) / 7; // Hypothèse: capacité maximale de 10^7
        // Gradient de bleu à rouge
        const r = Math.floor(55 + 200 * capacityScale);
        const g = Math.floor(55 + 150 * (1 - capacityScale));
        const b = Math.floor(200 * (1 - capacityScale));
        color = `rgb(${r}, ${g}, ${b})`;
      } else if (options.colorBy === "channels") {
        const channelsScale = Math.min(node.channels, 50) / 50; // Hypothèse: max 50 canaux
        // Gradient de vert à violet
        const r = Math.floor(55 + 150 * channelsScale);
        const g = Math.floor(200 * (1 - channelsScale));
        const b = Math.floor(55 + 200 * channelsScale);
        color = `rgb(${r}, ${g}, ${b})`;
      }

      // Mise en évidence du nœud sélectionné
      if (options.highlightNode === node.id) {
        ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
        ctx.shadowBlur = 15;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.arc(
        mapX(node.coordinates[0]),
        mapY(node.coordinates[1]),
        nodeRadius,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = color;
      ctx.fill();

      // Réinitialiser les ombres
      ctx.shadowBlur = 0;
    }
  });
}

export default function NetworkGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const t = useTranslations("pages.network.graph");
  const [graph, setGraph] = useState<NetworkGraphType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nodeSize, setNodeSize] = useState(5);
  const [edgeWidth, setEdgeWidth] = useState(1);
  const [colorBy, setColorBy] = useState<"group" | "capacity" | "channels">(
    "group"
  );
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [highlightNode, setHighlightNode] = useState<string | undefined>(
    undefined
  );
  const [selectedNode, setSelectedNode] = useState<NetworkGraphNode | null>(
    null
  );

  // Simuler le chargement des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // En développement, utiliser des données mockées
        if (process.env.NODE_ENV === "development") {
          setTimeout(() => {
            const processedNodes = forceDirectedLayout(
              mockNetworkGraph.nodes,
              mockNetworkGraph.edges
            );
            setGraph({
              ...mockNetworkGraph,
              nodes: processedNodes,
            });
            setLoading(false);
          }, 1000);
        } else {
          // En production, utiliser l'API réelle
          const mcpService = McpService.getInstance();
          const networkGraph = await mcpService.getNetworkGraph();
          const processedNodes = forceDirectedLayout(
            networkGraph.nodes,
            networkGraph.edges
          );
          setGraph({
            ...networkGraph,
            nodes: processedNodes,
          });
          setLoading(false);
        }
      } catch (err) {
        setError("Erreur lors du chargement du graphe réseau");
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Redessiner le graphe quand les données ou les options changent
  useEffect(() => {
    if (graph && canvasRef.current) {
      drawGraph(canvasRef.current, graph, {
        nodeSize,
        edgeWidth,
        highlightNode,
        colorBy,
        zoom,
        panOffset,
      });
    }
  }, [graph, nodeSize, edgeWidth, highlightNode, colorBy, zoom, panOffset]);

  // Ajuster la taille du canvas lors du redimensionnement de la fenêtre
  useEffect(() => {
    function handleResize() {
      if (canvasRef.current && canvasRef.current.parentElement) {
        canvasRef.current.width = canvasRef.current.parentElement.clientWidth;
        canvasRef.current.height = 500; // Hauteur fixe ou dynamique

        if (graph) {
          drawGraph(canvasRef.current, graph, {
            nodeSize,
            edgeWidth,
            highlightNode,
            colorBy,
            zoom,
            panOffset,
          });
        }
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [graph, nodeSize, edgeWidth, highlightNode, colorBy, zoom, panOffset]);

  // Gérer les interactions souris/tactiles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPanOffset({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleClick = (e: MouseEvent) => {
      if (!graph) return;

      // Calculer les coordonnées du clic dans l'espace du canvas
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Vérifier si un nœud a été cliqué
      const clickedNode = graph.nodes.find((node) => {
        if (!node.coordinates) return false;

        // Convertir les coordonnées du nœud en coordonnées canvas
        const minX = Math.min(
          ...graph.nodes
            .filter((n) => n.coordinates)
            .map((n) => n.coordinates![0])
        );
        const maxX = Math.max(
          ...graph.nodes
            .filter((n) => n.coordinates)
            .map((n) => n.coordinates![0])
        );
        const minY = Math.min(
          ...graph.nodes
            .filter((n) => n.coordinates)
            .map((n) => n.coordinates![1])
        );
        const maxY = Math.max(
          ...graph.nodes
            .filter((n) => n.coordinates)
            .map((n) => n.coordinates![1])
        );

        const width = maxX - minX || 1000;
        const height = maxY - minY || 1000;

        const nodeX =
          (((node.coordinates[0] - minX) / width) * 0.9 + 0.05) *
            canvas.width *
            zoom +
          panOffset.x;
        const nodeY =
          (((node.coordinates[1] - minY) / height) * 0.9 + 0.05) *
            canvas.height *
            zoom +
          panOffset.y;

        // Taille du nœud
        const nodeRadius = nodeSize * (1 + Math.log10(node.channels) / 2);

        // Vérifier si le clic est dans le cercle du nœud
        const distance = Math.sqrt(
          Math.pow(x - nodeX, 2) + Math.pow(y - nodeY, 2)
        );
        return distance <= nodeRadius;
      });

      if (clickedNode) {
        setHighlightNode(clickedNode.id);
        setSelectedNode(clickedNode);
      } else {
        setHighlightNode(undefined);
        setSelectedNode(null);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      // Ajuster le zoom
      const delta = e.deltaY * -0.001;
      const newZoom = Math.max(0.1, Math.min(5, zoom + delta));
      setZoom(newZoom);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("wheel", handleWheel);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [graph, isDragging, dragStart, panOffset, zoom, nodeSize]);

  // Télécharger l'image du graphe
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "lightning-network-graph.png";
    link.href = url;
    link.click();
  };

  // Réinitialiser le graphe
  const handleReset = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
    setHighlightNode(undefined);
    setSelectedNode(null);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{t("title")}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setZoom(Math.min(zoom + 0.2, 5))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setZoom(Math.max(0.2, zoom - 0.2))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleReset}
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Select
              value={colorBy}
              onValueChange={(value) =>
                setColorBy(value as "group" | "capacity" | "channels")
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Colorer par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="group">Groupe</SelectItem>
                <SelectItem value="capacity">Capacité</SelectItem>
                <SelectItem value="channels">Canaux</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[500px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[500px] text-destructive">
            {error}
          </div>
        ) : (
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="w-full h-[500px] border border-border rounded-md cursor-move"
              style={{ touchAction: "none" }}
            />

            {selectedNode && (
              <div className="absolute bottom-4 right-4 p-4 bg-card rounded-md border border-border shadow-lg max-w-xs">
                <h3 className="font-bold">{selectedNode.alias}</h3>
                <div className="text-xs text-muted-foreground mb-2">
                  {selectedNode.pubkey.substring(0, 16)}...
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Capacité:</div>
                  <div>
                    {Math.round(selectedNode.capacity / 100000) / 10} M sats
                  </div>
                  <div>Canaux:</div>
                  <div>{selectedNode.channels}</div>
                </div>
                <Button
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => {
                    // Rediriger vers la page du nœud
                    window.location.href = `/node/${selectedNode.pubkey}`;
                  }}
                >
                  Voir détails
                </Button>
              </div>
            )}
          </div>
        )}

        {graph && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex flex-col">
              <span className="text-muted-foreground">{t("nodes")}</span>
              <span className="font-bold">{graph.nodes.length}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">{t("channels")}</span>
              <span className="font-bold">{graph.edges.length}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">{t("diameter")}</span>
              <span className="font-bold">{graph.metrics.diameter}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">{t("density")}</span>
              <span className="font-bold">
                {graph.metrics.density.toFixed(3)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
