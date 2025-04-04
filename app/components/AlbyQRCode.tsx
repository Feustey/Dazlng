"use client";

import * as React from "react";

import { QRCodeSVG } from "qrcode.react";

interface AlbyQRCodeProps {
  amount: number;
  plan: string;
}

export default function AlbyQRCode({ amount, plan }: AlbyQRCodeProps) {
  // Format: lightning:<invoice>?amount=<amount>&label=<plan>
  const invoice = `lnbc${amount}sats1p${plan
    .toLowerCase()
    .replace(/\s+/g, "")}`;
  const qrValue = `lightning:${invoice}?amount=${amount}&label=${encodeURIComponent(
    plan
  )}`;

  return (
    <div className="flex flex-col items-center">
      <QRCodeSVG
        value={qrValue}
        size={256}
        level="H"
        includeMargin
        className="bg-white p-4 rounded-lg"
      />
      <div className="mt-4 text-sm text-gray-400 break-all text-center">
        {invoice}
      </div>
    </div>
  );
}
