"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Users, Leaf, Route, TrendingUp, TrendingDown } from "lucide-react"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const stats = [
  { label: "Active Citizens", value: "12,847", change: "+12%", trend: "up", icon: Users },
  { label: "Bins Monitored", value: "3,256", change: "+8%", trend: "up", icon: Trash2 },
  { label: "CO2 Saved (tons)", value: "847", change: "+23%", trend: "up", icon: Leaf },
  { label: "Routes Today", value: "24", change: "+6%", trend: "up", icon: Route },
]

const weeklyData = [
  { day: "Mon", waste: 420, recycled: 280 },
  { day: "Tue", waste: 380, recycled: 310 },
  { day: "Wed", waste: 510, recycled: 350 },
  { day: "Thu", waste: 460, recycled: 390 },
  { day: "Fri", waste: 520, recycled: 420 },
  { day: "Sat", waste: 350, recycled: 280 },
  { day: "Sun", waste: 280, recycled: 210 },
]

const segregationData = [
  { name: "Organic", value: 38, color: "oklch(0.55 0.17 155)" },
  { name: "Recyclable", value: 28, color: "oklch(0.65 0.15 85)" },
  { name: "E-Waste", value: 14, color: "oklch(0.5 0.1 200)" },
  { name: "Hazardous", value: 8, color: "oklch(0.55 0.22 27)" },
  { name: "General", value: 12, color: "oklch(0.5 0.03 160)" },
]

const binFillData = [
  { area: "Zone A", fill: 85 },
  { area: "Zone B", fill: 62 },
  { area: "Zone C", fill: 91 },
  { area: "Zone D", fill: 45 },
  { area: "Zone E", fill: 73 },
  { area: "Zone F", fill: 58 },
]

export function DashboardOverview() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Real-time overview of your smart waste management system.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50 bg-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium ${stat.trend === "up" ? "text-primary" : "text-destructive"}`}>
                  {stat.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold font-display text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-lg">Weekly Waste Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="wasteGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.5 0.03 160)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="oklch(0.5 0.03 160)" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="recycleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.55 0.17 155)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="oklch(0.55 0.17 155)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.015 155)" />
                <XAxis dataKey="day" stroke="oklch(0.5 0.03 160)" fontSize={12} />
                <YAxis stroke="oklch(0.5 0.03 160)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(1 0 0)",
                    border: "1px solid oklch(0.9 0.015 155)",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="waste" stroke="oklch(0.5 0.03 160)" fill="url(#wasteGrad)" strokeWidth={2} name="Total Waste (kg)" />
                <Area type="monotone" dataKey="recycled" stroke="oklch(0.55 0.17 155)" fill="url(#recycleGrad)" strokeWidth={2} name="Recycled (kg)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-lg">Waste Segregation</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={segregationData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {segregationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(1 0 0)",
                    border: "1px solid oklch(0.9 0.015 155)",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-2">
              {segregationData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground">{item.name} {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="font-display text-lg">Bin Fill Levels by Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={binFillData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.015 155)" />
              <XAxis dataKey="area" stroke="oklch(0.5 0.03 160)" fontSize={12} />
              <YAxis stroke="oklch(0.5 0.03 160)" fontSize={12} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(1 0 0)",
                  border: "1px solid oklch(0.9 0.015 155)",
                  borderRadius: "8px",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="fill" name="Fill Level (%)" radius={[6, 6, 0, 0]}>
                {binFillData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.fill > 85 ? "oklch(0.55 0.22 27)" : entry.fill > 70 ? "oklch(0.65 0.15 85)" : "oklch(0.55 0.17 155)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
