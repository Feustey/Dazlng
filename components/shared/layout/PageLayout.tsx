import React from 'react';
import styles from './PageLayout.module.css';

interface PageLayoutProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
}

export default function PageLayout({ children, style, contentStyle }: PageLayoutProps) {
  return (
    <div className={styles.pageLayout} style={style}>
      <div className={styles.pageContent} style={contentStyle}>
        {children}
      </div>
    </div>
  );
} 