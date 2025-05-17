import React from 'react';

interface PageTitleProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export default function PageTitle({ children, style }: PageTitleProps) {
  return (
    <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24, ...style }}>{children}</h1>
  );
} 