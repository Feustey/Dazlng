import React, { FC } from 'react';

interface StatsWidgetProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  status?: string;
}

const StatsWidget: FC<StatsWidgetProps> = ({ title, value, unit, icon, trend, status }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
      {icon && <div className="text-2xl mb-2">{icon}</div>}
      <div className="text-2xl font-bold mb-2">
        {value}{unit && ` ${unit}`}
      </div>
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
      {status && (
        <div className="text-xs mt-1 text-gray-400">{status}</div>
      )}
    </div>
  );
};

export default StatsWidget;