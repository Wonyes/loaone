import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "./Card";

export interface EmptyCardProps {
  title?: string;
  message?: string;
  className?: string;
  icon?: ReactNode;
}

export function EmptyCard({
  className,
  icon,
  title,
  message,
}: EmptyCardProps) {
  const defaultMessage = title ? `${title} 정보가 없습니다` : "정보가 없습니다";

  return (
    <Card title={title} icon={icon} className={cn(className)}>
      <div className="flex min-h-[120px] flex-col items-center justify-center p-6 text-center">
        <p className="text-sm font-medium text-gray-500">
          {message || defaultMessage}
        </p>
      </div>
    </Card>
  );
}
