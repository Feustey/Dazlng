import { NextRequest, NextResponse } from "next/server";

export interface Channel {
  id: string;
  remotePubkey: string;
  remoteAlias?: string;
  capacity: number;
  localBalance: number;
  remoteBalance: number;
  status: "active" | "inactive" | "pending" | "closing";
  isPrivate: boolean;
  channelPoint: string;
  feeRatePerKw: number;
  baseFee: number;
  feeRate: number;
  timelock: number;
  minHtlc: number;
  maxHtlc: number;
  lastUpdate: string;
  uptime: number;
}

interface ChannelUpdate {
  id: string;
  baseFee?: number;
  feeRate?: number;
  timelock?: number;
  minHtlc?: number;
  maxHtlc?: number;
  lastUpdate: string;
}

interface ChannelClosing {
  id: string;
  status: string;
  closingTxId: string;
  estimatedConfirmation: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ nodeId: string; channelId: string }> }
): Promise<Response> {
  try {
    const resolvedParams = await params;
    const { nodeId, channelId } = resolvedParams;
    
    // Validation de la pubkey
    if (!/^[0-9a-fA-F]{66}$/.test(nodeId)) {
      return NextResponse.json<ApiResponse<Channel>>({
        success: false,
        error: {
          code: "INVALID_NODE_ID",
          message: "ID de nœud invalide"
        }
      }, { status: 400 });
    }

    // Simulation des données d'un canal spécifique
    const mockChannel: Channel = {
      id: channelId,
      remotePubkey: `03${Math.random().toString(16).substring(2, 66).padEnd(64, "0")}`,
      remoteAlias: "Lightning Node",
      capacity: 5000000,
      localBalance: 2500000,
      remoteBalance: 2500000,
      status: "active",
      isPrivate: false,
      channelPoint: `${Math.random().toString(16).substring(2, 66)}:0`,
      feeRatePerKw: 253,
      baseFee: 1,
      feeRate: 100,
      timelock: 144,
      minHtlc: 1000,
      maxHtlc: 990000,
      lastUpdate: new Date().toISOString(),
      uptime: 98.5
    };

    return NextResponse.json<ApiResponse<Channel>>({
      success: true,
      data: mockChannel
    });

  } catch (error) {
    console.error("Erreur lors de la récupération du canal:", error);
    return NextResponse.json<ApiResponse<Channel>>({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur interne du serveur"
      }
    }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ nodeId: string; channelId: string }> }
): Promise<Response> {
  try {
    const resolvedParams = await params;
    const { nodeId, channelId } = resolvedParams;
    const body = await req.json();
    
    // Validation de la pubkey
    if (!/^[0-9a-fA-F]{66}$/.test(nodeId)) {
      return NextResponse.json<ApiResponse<ChannelUpdate>>({
        success: false,
        error: {
          code: "INVALID_NODE_ID",
          message: "ID de nœud invalide"
        }
      }, { status: 400 });
    }

    // Validation des paramètres de mise à jour
    const { baseFee, feeRate, timelock, minHtlc, maxHtlc } = body;
    
    if (baseFee !== undefined && (baseFee < 0 || baseFee > 1000)) {
      return NextResponse.json<ApiResponse<ChannelUpdate>>({
        success: false,
        error: {
          code: "INVALID_BASE_FEE",
          message: "Frais de base invalide (0-1000 msat)"
        }
      }, { status: 400 });
    }

    if (feeRate !== undefined && (feeRate < 0 || feeRate > 1000000)) {
      return NextResponse.json<ApiResponse<ChannelUpdate>>({
        success: false,
        error: {
          code: "INVALID_FEE_RATE",
          message: "Taux de frais invalide (0-1,000,000 ppm)"
        }
      }, { status: 400 });
    }

    // Simulation de la mise à jour
    const updatedChannel: ChannelUpdate = {
      id: channelId,
      baseFee: baseFee ?? 1,
      feeRate: feeRate ?? 100,
      timelock: timelock ?? 144,
      minHtlc: minHtlc ?? 1000,
      maxHtlc: maxHtlc ?? 990000,
      lastUpdate: new Date().toISOString()
    };

    return NextResponse.json<ApiResponse<ChannelUpdate>>({
      success: true,
      data: updatedChannel
    });

  } catch (error) {
    console.error("Erreur lors de la mise à jour du canal:", error);
    return NextResponse.json<ApiResponse<ChannelUpdate>>({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur interne du serveur"
      }
    }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ nodeId: string; channelId: string }> }
): Promise<Response> {
  try {
    const resolvedParams = await params;
    const { nodeId, channelId } = resolvedParams;
    const { searchParams } = new URL(req.url);
    const force = searchParams.get("force") === "true";
    
    // Validation de la pubkey
    if (!/^[0-9a-fA-F]{66}$/.test(nodeId)) {
      return NextResponse.json<ApiResponse<ChannelClosing>>({
        success: false,
        error: {
          code: "INVALID_NODE_ID",
          message: "ID de nœud invalide"
        }
      }, { status: 400 });
    }

    // Simulation de la fermeture du canal
    const closingChannel: ChannelClosing = {
      id: channelId,
      status: force ? "force_closing" : "cooperative_closing",
      closingTxId: `${Math.random().toString(16).substring(2, 66)}`,
      estimatedConfirmation: force ? "6 blocks" : "1-3 blocks"
    };

    return NextResponse.json<ApiResponse<ChannelClosing>>({
      success: true,
      data: closingChannel
    });

  } catch (error) {
    console.error("Erreur lors de la fermeture du canal:", error);
    return NextResponse.json<ApiResponse<ChannelClosing>>({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur interne du serveur"
      }
    }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";