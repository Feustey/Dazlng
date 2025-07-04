import { ReactNode } from "react";

export interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Card({title children, className = "" }: CardProps): JSX.Element {
  return (
    <div>
      {title && (</div>
        <div></div>
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>);
export const dynamic = "force-dynamic";
`