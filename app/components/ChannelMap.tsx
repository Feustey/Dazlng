"use client";

import { useEffect, useRef } from "react";
import { Card } from "@/app/components/ui/card";

interface Channel {
  id: string;
  remoteNodeId: string;
  capacity: number;
  age: string;
}

interface ChannelMapProps {
  channels?: Channel[];
}

export default function ChannelMap({ channels = [] }: ChannelMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Définir les dimensions du canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner le nœud central (Feustey)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const centerRadius = 30;

    // Dessiner le cercle central
    ctx.beginPath();
    ctx.arc(centerX, centerY, centerRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#f97316"; // Orange
    ctx.fill();
    ctx.strokeStyle = "#ea580c";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Ajouter le texte "Feustey"
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Feustey", centerX, centerY);

    // Si nous n'avons pas de canaux, dessiner un message
    if (channels.length === 0) {
      ctx.font = "16px sans-serif";
      ctx.fillStyle = "#64748b";
      ctx.fillText("Aucun canal disponible", centerX, centerY + 60);
      return;
    }

    // Calculer le rayon pour les nœuds distants
    const radius = Math.min(canvas.width, canvas.height) * 0.35;

    // Dessiner les canaux et les nœuds distants
    channels.forEach((channel, index) => {
      // Calculer la position du nœud distant
      const angle = (index / channels.length) * Math.PI * 2;
      const remoteX = centerX + Math.cos(angle) * radius;
      const remoteY = centerY + Math.sin(angle) * radius;
      const remoteRadius = 20;

      // Dessiner la ligne de connexion
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(remoteX, remoteY);
      ctx.strokeStyle = "#3b82f6"; // Bleu
      ctx.lineWidth = 2;
      ctx.stroke();

      // Dessiner le cercle du nœud distant
      ctx.beginPath();
      ctx.arc(remoteX, remoteY, remoteRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#60a5fa"; // Bleu clair
      ctx.fill();
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Ajouter le texte du nœud distant (tronqué)
      const shortId = channel.remoteNodeId.substring(0, 8) + "...";
      ctx.font = "12px sans-serif";
      ctx.fillStyle = "white";
      ctx.fillText(shortId, remoteX, remoteY);

      // Ajouter la capacité
      ctx.font = "10px sans-serif";
      ctx.fillStyle = "#64748b";
      const capacity =
        channel.capacity >= 1000000
          ? `${(channel.capacity / 1000000).toFixed(1)}M`
          : `${(channel.capacity / 1000).toFixed(0)}k`;
      ctx.fillText(`${capacity} sats`, remoteX, remoteY + 15);
    });
  }, [channels]);

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Carte des Canaux</h3>
      <div className="h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ background: "transparent" }}
        />
      </div>
    </Card>
  );
}
