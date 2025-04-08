"use client";

import * as React from "react";

import { QRCodeSVG } from "qrcode.react";

export interface AlbyQRCodeProps {
  amount: number;
  memo?: string;
}

export default function AlbyQRCode({ amount, memo }: AlbyQRCodeProps) {
  const albyUrl = `bitcoin:${process.env.NEXT_PUBLIC_ALBY_LIGHTNING_ADDRESS}?amount=${amount}${memo ? `&memo=${encodeURIComponent(memo)}` : ""}`;

  return (
    <div className="bg-white p-4 rounded-lg">
      <QRCodeSVG value={albyUrl} size={256} />
    </div>
  );
}
