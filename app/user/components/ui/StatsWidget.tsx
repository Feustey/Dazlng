import React, { FC } from 'react';

export interface StatsWidgetProps {
  title: string;
  value: string | number;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const StatsWidget: FC<StatsWidgetProps> = ({ title, value, icon, trend }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
      {icon && <div className="text-2xl mb-2">{icon}</div>}
      <div className="text-2xl font-bold mb-2">{value}</div>
      <div className="text-gray-500 text-center">{title}</div>
      {trend && (
        <div className={`text-sm mt-2 ${
          trend === 'up' ? 'text-green-600' : 
          trend === 'down' ? 'text-red-600' : 
          'text-gray-500'
        }`}>
          {trend === 'up' ? '↗️' : trend === 'down' ? '↘️' : '→'}
        </div>
      )}
    </div>
  );
};

export default StatsWidget;export const dynamic = "force-dynamic";
