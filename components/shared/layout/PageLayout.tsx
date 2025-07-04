import React from "react";

export interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export default function PageLayout({children className = "', contentClassName = '' }: PageLayoutProps): React.ReactElement {
  return (
    <div>`</div>
      <div>
        {children}</div>
      </div>
    </div>);
`