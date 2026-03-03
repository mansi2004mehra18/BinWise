"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Route,
  Leaf,
  Truck,
  Clock,
  MapPin,
  Zap,
  TrendingDown,
  Play,
  RotateCcw,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

const routeStops = [
  { id: 1, bin: "BIN-C02", fill: 95, location: "Sector 7, Mall Entry", order: 1 },
  { id: 2, bin: "BIN-A01", fill: 92, location: "Sector 5, Main Road", order: 2 },
  { id: 3, bin: "BIN-B02", fill: 88, location: "Sector 3, School Rd", order: 3 },
  { id: 4, bin: "BIN-E02", fill: 84, location: "Sector 9, Station Rd", order: 4 },
  { id: 5, bin: "BIN-D01", fill: 73, location: "Sector 1, City Hall", order: 5 },
]

const carbonMonthly = [
  { month: "Sep", saved: 52, emitted: 28 },
  { month: "Oct", saved: 61, emitted: 25 },
  { month: "Nov", saved: 73, emitted: 22 },
  { month: "Dec", saved: 85, emitted: 20 },
  { month: "Jan", saved: 92, emitted: 18 },
  { month: "Feb", saved: 108, emitted: 15 },
  { month: "Mar", saved: 118, emitted: 13 },
]

const routeComparison = [
  { route: "Unoptimized", distance: 45, fuel: 12.5, time: 180 },
  { route: "Optimized", distance: 28, fuel: 7.2, time: 105 },
]

export function RouteOptimizer() {
  const [optimizing, setOptimizing] = useState(false)
  const [optimized, setOptimized] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleOptimize = () => {
    setOptimizing(true)
    setTimeout(() => {
      setOptimizing(false)
      setOptimized(true)
    }, 2500)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    ctx.fillStyle = "#f0fdf4"
    ctx.fillRect(0, 0, rect.width, rect.height)

    ctx.strokeStyle = "#dcfce7"
    ctx.lineWidth = 0.5
    for (let i = 0; i < rect.width; i += 30) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, rect.height)
      ctx.stroke()
    }
    for (let j = 0; j < rect.height; j += 30) {
      ctx.beginPath()
      ctx.moveTo(0, j)
      ctx.lineTo(rect.width, j)
      ctx.stroke()
    }

    const points = [
      { x: 0.7, y: 0.25, label: "BIN-C02 (95%)" },
      { x: 0.15, y: 0.3, label: "BIN-A01 (92%)" },
      { x: 0.4, y: 0.45, label: "BIN-B02 (88%)" },
      { x: 0.8, y: 0.55, label: "BIN-E02 (84%)" },
      { x: 0.3, y: 0.7, label: "BIN-D01 (73%)" },
    ]
    const depot = { x: 0.5, y: 0.85, label: "Depot" }

    if (optimized) {
      ctx.strokeStyle = "#16a34a"
      ctx.lineWidth = 3
      ctx.setLineDash([8, 4])
      ctx.beginPath()
      ctx.moveTo(depot.x * rect.width, depot.y * rect.height)
      points.forEach(p => {
        ctx.lineTo(p.x * rect.width, p.y * rect.height)
      })
      ctx.lineTo(depot.x * rect.width, depot.y * rect.height)
      ctx.stroke()
      ctx.setLineDash([])
    }

    points.forEach((p, i) => {
      const x = p.x * rect.width
      const y = p.y * rect.height
      ctx.beginPath()
      ctx.arc(x, y, 16, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(220, 38, 38, 0.1)"
      ctx.fill()
      ctx.beginPath()
      ctx.arc(x, y, 10, 0, Math.PI * 2)
      ctx.fillStyle = "#dc2626"
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 10px Inter, sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(`${i + 1}`, x, y)
      ctx.fillStyle = "#374151"
      ctx.font = "10px Inter, sans-serif"
      ctx.textAlign = "left"
      ctx.textBaseline = "top"
      ctx.fillText(p.label, x + 14, y - 5)
    })

    const dx = depot.x * rect.width
    const dy = depot.y * rect.height
    ctx.beginPath()
    ctx.arc(dx, dy, 12, 0, Math.PI * 2)
    ctx.fillStyle = "#16a34a"
    ctx.fill()
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 10px Inter, sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("D", dx, dy)
    ctx.fillStyle = "#374151"
    ctx.font = "10px Inter, sans-serif"
    ctx.textAlign = "left"
    ctx.fillText("Depot", dx + 16, dy - 5)
  }, [optimized])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Route Optimizer</h1>
          <p className="text-muted-foreground mt-1">VRP-optimized collection routes with carbon emission tracking.</p>
        </div>
        <div className="flex gap-2">
          {optimized && (
            <Button variant="outline" onClick={() => setOptimized(false)} className="border-border text-foreground hover:bg-secondary">
              <RotateCcw className="w-4 h-4 mr-2" /> Reset
            </Button>
          )}
          <Button onClick={handleOptimize} disabled={optimizing} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {optimizing ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                Optimizing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" /> Run VRP Algorithm
              </>
            )}
          </Button>
        </div>
      </div>

      {optimized && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Route, value: "28 km", label: "Total Distance" },
            { icon: Clock, value: "1h 45m", label: "Est. Time" },
            { icon: Truck, value: "7.2 L", label: "Fuel Est." },
            { icon: Leaf, value: "5.3 kg", label: "CO2 Saved" },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold font-display text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3 border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-lg">Optimized Route Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl overflow-hidden border border-border/50">
              <canvas ref={canvasRef} className="w-full" style={{ height: 380 }} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Collection Stops
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {routeStops.map((stop, index) => (
                <div key={stop.id} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${optimized ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                      {stop.order}
                    </div>
                    {index < routeStops.length - 1 && (
                      <div className={`w-0.5 h-6 ${optimized ? "bg-primary/30" : "bg-border"}`} />
                    )}
                  </div>
                  <div className="flex-1 p-3 rounded-lg bg-secondary/50 border border-border/30">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{stop.bin}</p>
                      <Badge className={stop.fill > 90 ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-accent/20 text-accent-foreground border-accent/30"}>
                        {stop.fill}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{stop.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Leaf className="w-4 h-4 text-primary" /> Carbon Emission Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={carbonMonthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.015 155)" />
                <XAxis dataKey="month" stroke="oklch(0.5 0.03 160)" fontSize={12} />
                <YAxis stroke="oklch(0.5 0.03 160)" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "oklch(1 0 0)", border: "1px solid oklch(0.9 0.015 155)", borderRadius: "8px", fontSize: 12 }} />
                <Line type="monotone" dataKey="saved" stroke="oklch(0.55 0.17 155)" strokeWidth={2.5} dot={{ fill: "oklch(0.55 0.17 155)", r: 4 }} name="CO2 Saved (kg)" />
                <Line type="monotone" dataKey="emitted" stroke="oklch(0.55 0.22 27)" strokeWidth={2} dot={{ fill: "oklch(0.55 0.22 27)", r: 3 }} name="CO2 Emitted (kg)" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-primary" /> Route Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={routeComparison} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.015 155)" />
                <XAxis type="number" stroke="oklch(0.5 0.03 160)" fontSize={12} />
                <YAxis type="category" dataKey="route" stroke="oklch(0.5 0.03 160)" fontSize={12} width={90} />
                <Tooltip contentStyle={{ backgroundColor: "oklch(1 0 0)", border: "1px solid oklch(0.9 0.015 155)", borderRadius: "8px", fontSize: 12 }} />
                <Bar dataKey="distance" name="Distance (km)" fill="oklch(0.55 0.17 155)" radius={[0, 4, 4, 0]} />
                <Bar dataKey="fuel" name="Fuel (L)" fill="oklch(0.65 0.15 85)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Optimization Results</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold font-display text-primary">37%</p>
                  <p className="text-xs text-muted-foreground">Less Distance</p>
                </div>
                <div>
                  <p className="text-lg font-bold font-display text-primary">42%</p>
                  <p className="text-xs text-muted-foreground">Fuel Saved</p>
                </div>
                <div>
                  <p className="text-lg font-bold font-display text-primary">42%</p>
                  <p className="text-xs text-muted-foreground">Time Saved</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
