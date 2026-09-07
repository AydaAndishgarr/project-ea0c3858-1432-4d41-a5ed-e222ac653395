import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const axis = {
  tick: { fontSize: 12, fontFamily: "Vazirmatn" },
  stroke: "var(--color-border)",
};

const tooltipStyle = {
  contentStyle: {
    direction: "rtl" as const,
    fontFamily: "Vazirmatn",
    fontSize: 12,
    borderRadius: 12,
    border: "1px solid var(--color-border)",
    background: "var(--color-card)",
    color: "var(--color-card-foreground)",
  },
};

export function AreaTrend({
  data,
  keys,
}: {
  data: Record<string, string | number>[];
  keys: { key: string; color: string }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <defs>
          {keys.map((k) => (
            <linearGradient key={k.key} id={`grad-${k.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={k.color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={k.color} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="month" reversed {...axis} />
        <YAxis orientation="right" {...axis} width={40} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontFamily: "Vazirmatn", fontSize: 12 }} />
        {keys.map((k) => (
          <Area
            key={k.key}
            type="monotone"
            dataKey={k.key}
            stroke={k.color}
            fill={`url(#grad-${k.key})`}
            strokeWidth={2}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function BarsChart({
  data,
  keys,
}: {
  data: Record<string, string | number>[];
  keys: { key: string; color: string }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="month" reversed {...axis} />
        <YAxis orientation="right" {...axis} width={40} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontFamily: "Vazirmatn", fontSize: 12 }} />
        {keys.map((k) => (
          <Bar key={k.key} dataKey={k.key} fill={k.color} radius={[6, 6, 0, 0]} maxBarSize={38} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function LineTrend({
  data,
  dataKey,
  color,
}: {
  data: Record<string, string | number>[];
  dataKey: string;
  color: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="month" reversed {...axis} />
        <YAxis orientation="right" {...axis} width={40} />
        <Tooltip {...tooltipStyle} />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function DonutChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
          {data.map((d) => (
            <Cell key={d.name} fill={d.color} />
          ))}
        </Pie>
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontFamily: "Vazirmatn", fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
