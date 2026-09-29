import { createFileRoute } from "@tanstack/react-router";
import { Vote } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useActions, useApp } from "@/store/app-store";
import { faDigits } from "@/lib/format";

export const Route = createFileRoute("/resident/polls")({
  head: () => ({
    meta: [
      { title: "نظرسنجی‌ها | پنل ساکن | خانه یار" },
      { name: "description", content: "شرکت در نظرسنجی‌های ساختمان و مشاهده نتایج." },
    ],
  }),
  component: ResidentPolls,
});

function ResidentPolls() {
  const { state } = useApp();
  const { vote } = useActions();

  return (
    <>
      <PageHeader
        title="نظرسنجی‌ها"
        description="در تصمیم‌گیری‌های ساختمان مشارکت کنید"
        breadcrumb={["پنل ساکن", "نظرسنجی‌ها"]}
      />

      {state.polls.length === 0 ? (
        <EmptyState icon={Vote} title="نظرسنجی فعالی وجود ندارد" />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {state.polls.map((p) => {
            const total = p.options.reduce((a, o) => a + o.votes, 0) || 1;
            const voted = !!p.votedOption;
            return (
              <Card key={p.id} className="gap-3 p-5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                  <p className="font-semibold">{p.question}</p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-xs ${
                      p.closed ? "bg-muted text-muted-foreground" : "bg-success/15 text-success"
                    }`}
                  >
                    {p.closed ? "بسته شده" : "در حال اجرا"}
                  </span>
                </div>
                <p className="text-sm leading-7 text-muted-foreground">{p.description}</p>
                <div className="space-y-3">
                  {p.options.map((o) => (
                    <div key={o.id}>
                      <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                        <span>{o.label}</span>
                        {(voted || p.closed) && (
                          <span className="text-muted-foreground">
                            {faDigits(Math.round((o.votes / total) * 100))}٪ ({faDigits(o.votes)} رأی)
                          </span>
                        )}
                      </div>
                      {(voted || p.closed) && <Progress value={(o.votes / total) * 100} />}
                      {!p.closed && !voted && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-1 w-full"
                          onClick={() => {
                            vote(p.id, o.id);
                            toast.success("رأی شما ثبت شد.");
                          }}
                        >
                          انتخاب «{o.label}»
                        </Button>
                      )}
                      {p.votedOption === o.id && (
                        <p className="mt-1 text-xs text-primary">رأی شما</p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
