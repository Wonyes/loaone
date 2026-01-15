import { Card } from "./Card";

interface EmptyCardProps {
  title: string;
  message?: string;
}

export function EmptyCard({ title, message }: EmptyCardProps) {
  return (
    <Card title={title}>
      <div className="flex min-h-[120px] flex-col items-center justify-center p-6">
        <p className="text-center text-sm font-medium text-gray-500">
          {message || `${title} 정보가 없습니다`}
        </p>
      </div>
    </Card>
  );
}
