import { cn } from "@/lib/utils";

interface AdminHeaderProps {
  title: string;
  description: string;
  badge?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function AdminHeader({
  title,
  description,
  badge,
  className,
}: AdminHeaderProps) {
  return (
    <div className={cn(className)}>
      <div className="flex items-center gap-3 mb-1">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          {title}
        </h1>
        {badge && (
          <span className="px-2 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wider bg-primary/10 text-primary rounded-full">
            {badge}
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
