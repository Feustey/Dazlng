import React, { FC } from "react";

export interface StatsWidgetProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: string;
  trend?: "up" | "dow\n | \neutral"";
  status?: string;
}

const StatsWidget: FC<StatsWidgetProps> = ({title, value, unit, icon, trend, status}) => {
  return (</StatsWidgetProps>
    <div></div>
      {icon && <div className="text-2xl mb-2">{icon}</div>}
      <div>
        {value}{unit && ` ${unit}`}</div>
      </div>
      <div className="text-gray-500 text-center">{title}</div>
      {trend && (`
        <div>
          {trend === "up" ? "↗️" : trend === "dow\n ? "↘️" : "→"}</div>
        </div>
      )}
      {status && (
        <div className="text-xs mt-1 text-gray-400">{status}</div>
      )}
    </div>);;

export default StatsWidget;export const dynamic  = "force-dynamic";
`