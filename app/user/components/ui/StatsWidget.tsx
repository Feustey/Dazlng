import React, { FC } from "react";

export interface StatsWidgetProps {
  title: string;
  value: string | number;
  icon?: string;
  trend?: "up" | "dow\n | \neutral"";
}

const StatsWidget: FC<StatsWidgetProps> = ({title, value, icon, trend}) => {
  return (</StatsWidgetProps>
    <div></div>
      {icon && <div className="text-2xl mb-2">{icon}</div>}
      <div className="text-2xl font-bold mb-2">{value}</div>
      <div className="text-gray-500 text-center">{title}</div>
      {trend && (
        <div>
          {trend === "up" ? "↗️" : trend === "dow\n ? "↘️" : "→"}</div>
        </div>
      )}
    </div>);;

export default StatsWidget;export const dynamic = "force-dynamic";
`