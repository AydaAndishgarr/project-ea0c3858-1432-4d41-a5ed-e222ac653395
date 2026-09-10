import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Building2, Home, Users, Wallet } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/store/app-store";
import { formatCompactToman, formatNumber } from "@/lib/format";

export const Route = createFileRoute("/manager/building")({
  head: () => ({
    meta: [
      { title: "اطلاعات ساختمان | پنل مدیر ساختمان" },
      { name: "description", content: "مشخصات ساختمان، امکانات و اطلاعات تماس مدیریت." },
      { property: "og:title", content: "اطلاعات ساختمان" },
      { property: "og:description", content: "ویرایش مشخصات ساختمان." },
    ],
  }),
  component: BuildingPage,
});

function BuildingPage() {
  const { state } = useApp();
  const [form, setForm] = useState({
    name: "برج نگین سعادت",
    address: "تهران، سعادت‌آباد، بلوار دریا، کوچه لاله ۳",
    floors: "۶",
    parking: "۵۲",
    manager: "رضا موسوی",
    phone: "۰۹۱۲۳۴۵۶۷۸۹",
    about: "مجتمع مسکونی ۴۸ واحدی با دو بلوک، لابی مشترک، سالن ورزشی و پارکینگ طبقاتی.",
  });

  return (
    <>
      <PageHeader
        title="اطلاعات ساختمان"
        description="مشخصات کلی و امکانات ساختمان"
        breadcrumb={["پنل مدیر ساختمان", "ساختمان"]}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="تعداد واحدها" value={formatNumber(state.units.length)} icon={Home} />
        <StatCard title="تعداد ساکنان" value={formatNumber(state.residents.length)} icon={Users} tone="info" />
        <StatCard title="تعداد طبقات" value="۶" icon={Building2} tone="success" />
        <StatCard title="بودجه سالانه" value={formatCompactToman(980000000)} icon={Wallet} tone="warning" />
      </div>

      <Card className="mt-6 gap-4 p-5">
        <p className="font-semibold">ویرایش مشخصات</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="mb-2 block">نام ساختمان</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label className="mb-2 block">نام مدیر</Label>
            <Input value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <Label className="mb-2 block">آدرس</Label>
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div>
            <Label className="mb-2 block">تعداد طبقات</Label>
            <Input value={form.floors} onChange={(e) => setForm({ ...form, floors: e.target.value })} />
          </div>
          <div>
            <Label className="mb-2 block">تعداد پارکینگ</Label>
            <Input value={form.parking} onChange={(e) => setForm({ ...form, parking: e.target.value })} />
          </div>
          <div>
            <Label className="mb-2 block">شماره تماس مدیریت</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <Label className="mb-2 block">درباره ساختمان</Label>
            <Textarea rows={4} value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} />
          </div>
        </div>
        <Button className="w-fit" onClick={() => toast.success("اطلاعات ساختمان با موفقیت ذخیره شد.")}>
          ذخیره تغییرات
        </Button>
      </Card>
    </>
  );
}
