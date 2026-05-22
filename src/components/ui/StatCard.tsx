import { TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  icon?: React.ReactNode;
}

export function StatCard({ title, value, change, icon }: StatCardProps) {
  return (
    <div className="card p-5 lg:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-xl lg:text-2xl font-bold text-[#1e1e2f]">{value}</p>
          {change && (
            <p className="mt-2 flex items-center gap-1 text-xs font-medium text-green-600">
              <TrendingUp size={14} />
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-blue-50 text-[#3b82f6]">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
