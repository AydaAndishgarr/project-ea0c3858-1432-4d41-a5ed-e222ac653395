import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  breadcrumb,
  action,
}: {
  title: string;
  description?: string;
  breadcrumb?: string[];
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
      <div className="min-w-0">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="mb-1 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
            {breadcrumb.map((item, i) => (
              <span key={item} className="flex items-center gap-1">
                {i > 0 && <span className="text-border">/</span>}
                <span>{item}</span>
              </span>
            ))}
          </nav>
        )}
        <h1 className="truncate text-xl font-bold text-foreground sm:text-2xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
