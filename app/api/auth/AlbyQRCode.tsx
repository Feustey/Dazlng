import { QRCodeSVG } from "qrcode.react";

interface AlbyQRCodeProps {
  value: string;
  amount: number;
  memo?: string;
}

export default function AlbyQRCode({ value, amount, memo }: AlbyQRCodeProps): React.ReactElement {
  const paymentRequest = `lightning:${value}?amount=${amount}${memo ? `&memo=${encodeURIComponent(memo)}` : ""}`;

  return (
    <div className="flex flex-col items-center">
      <QRCodeSVG value={paymentRequest} size={200} />
      <p className="mt-2 text-sm text-gray-500 break-all">{paymentRequest}</p>
    </div>
  );
}
