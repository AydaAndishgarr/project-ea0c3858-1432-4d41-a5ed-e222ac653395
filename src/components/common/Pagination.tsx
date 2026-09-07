import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { faDigits } from "@/lib/format";

export function SimplePagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (p: number) => void;
}) {
  if (pageCount <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      <Button variant="outline" size="icon" disabled={page === 1} onClick={() => onChange(page - 1)}>
        <ChevronRight className="size-4" />
      </Button>
      <span className="text-sm text-muted-foreground">
        صفحه {faDigits(page)} از {faDigits(pageCount)}
      </span>
      <Button
        variant="outline"
        size="icon"
        disabled={page === pageCount}
        onClick={() => onChange(page + 1)}
      >
        <ChevronLeft className="size-4" />
      </Button>
    </div>
  );
}
