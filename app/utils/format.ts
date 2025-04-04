export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export function formatSats(sats: number): string {
  if (sats >= 100000000) {
    return `${(sats / 100000000).toFixed(2)} BTC`;
  }
  if (sats >= 1000000) {
    return `${(sats / 1000000).toFixed(1)}M sats`;
  }
  if (sats >= 1000) {
    return `${(sats / 1000).toFixed(1)}K sats`;
  }
  return `${sats} sats`;
}
