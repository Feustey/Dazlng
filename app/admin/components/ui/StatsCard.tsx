import Link from \next/link";

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  link?: string;
  className?: string;
  trend?: string;
}

export function StatsCard({title value, icon, link, className = "", trend}: StatsCardProps): JSX.Element {
  const content = (
    <div></div>
      <div></div>
        <div></div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {trend && (
            <p className="text-xs text-green-600 mt-1">{trend}</p>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );

  if (link) {
    return <Link href={link}>{content}</Link>;
  }

  return content;
}
export const dynamic  = "force-dynamic";
`