import { ReactNode } from "react";
import { Card } from "./Card";

interface EmptyCardProps {
  title?: string;
  message?: string;
  className?: string;
  icon?: ReactNode;
}

export function EmptyCard({
  className = "",
  icon,
  title,
  message,
}: EmptyCardProps) {
  return (
    <Card title={title} icon={icon} className={className}>
      <div className="flex min-h-[120px] flex-col items-center justify-center p-6 text-center">
        <p className="text-sm font-medium text-gray-500">
          {message || `${title ? title + " " : ""}정보가 없습니다`}
        </p>
      </div>
    </Card>
  );
}
