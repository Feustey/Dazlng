import Link from "next/link";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  link?: string;
  className?: string;
}

export function StatsCard({ title, value, icon, link, className = "" }: StatsCardProps): JSX.Element {
  const content = (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
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