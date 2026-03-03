"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, MapPin, Wifi, WifiOff, AlertTriangle, RefreshCw } from "lucide-react"

const bins = [
  { id: "BIN-A01", location: "Sector 5, Main Road", type: "Organic", fill: 92, lat: 28.6139, lng: 77.209, online: true },
  { id: "BIN-A02", location: "Sector 5, Park Gate", type: "Recyclable", fill: 67, lat: 28.615, lng: 77.211, online: true },
  { id: "BIN-B01", location: "Sector 3, Market St", type: "General", fill: 45, lat: 28.618, lng: 77.215, online: true },
  { id: "BIN-B02", location: "Sector 3, School Rd", type: "Organic", fill: 88, lat: 28.62, lng: 77.213, online: false },
  { id: "BIN-C01", location: "Sector 7, Tech Park", type: "E-Waste", fill: 31, lat: 28.625, lng: 77.22, online: true },
  { id: "BIN-C02", location: "Sector 7, Mall Entry", type: "Recyclable", fill: 95, lat: 28.627, lng: 77.218, online: true },
  { id: "BIN-D01", location: "Sector 1, City Hall", type: "General", fill: 73, lat: 28.63, lng: 77.225, online: true },
  { id: "BIN-D02", location: "Sector 1, Bus Stop", type: "Organic", fill: 56, lat: 28.632, lng: 77.222, online: true },
  { id: "BIN-E01", location: "Sector 9, Hospital", type: "Hazardous", fill: 41, lat: 28.635, lng: 77.228, online: true },
  { id: "BIN-E02", location: "Sector 9, Station Rd", type: "Recyclable", fill: 84, lat: 28.637, lng: 77.23, online: false },
]

function getFillColor(fill: number) {
  if (fill > 90) return "bg-destructive text-destructive"
  if (fill > 70) return "bg-accent text-accent-foreground"
  return "bg-primary text-primary"
}

function getFillBarColor(fill: number) {
  if (fill > 90) return "[&>div]:bg-destructive"
  if (fill > 70) return "[&>div]:bg-accent"
  return "[&>div]:bg-primary"
}

function getFillLabel(fill: number) {
  if (fill > 90) return "Critical"
  if (fill > 70) return "High"
  if (fill > 40) return "Medium"
  return "Low"
}

export function BinMonitor() {
  const [filter, setFilter] = useState("all")

  const filteredBins = filter === "all" ? bins : filter === "critical" ? bins.filter(b => b.fill > 90) : filter === "high" ? bins.filter(b => b.fill > 70 && b.fill <= 90) : bins.filter(b => b.fill <= 70)

  const criticalCount = bins.filter(b => b.fill > 90).length
  const highCount = bins.filter(b => b.fill > 70 && b.fill <= 90).length
  const offlineCount = bins.filter(b => !b.online).length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Bin Monitor</h1>
          <p className="text-muted-foreground mt-1">Real-time monitoring of all smart bins across the city.</p>
        </div>
        <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-secondary">
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-border/50 cursor-pointer hover:border-primary/30 transition-colors" onClick={() => setFilter("all")}>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold font-display text-foreground">{bins.length}</p>
            <p className="text-xs text-muted-foreground">Total Bins</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 cursor-pointer hover:border-destructive/30 transition-colors" onClick={() => setFilter("critical")}>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold font-display text-destructive">{criticalCount}</p>
            <p className="text-xs text-muted-foreground">Critical ({'>'}90%)</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 cursor-pointer hover:border-accent/30 transition-colors" onClick={() => setFilter("high")}>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold font-display text-accent-foreground">{highCount}</p>
            <p className="text-xs text-muted-foreground">High (70-90%)</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold font-display text-destructive">{offlineCount}</p>
            <p className="text-xs text-muted-foreground">Offline</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="font-display text-lg">All Bins</CardTitle>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40 bg-secondary/50 border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-foreground">
              <SelectItem value="all">All Bins</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High Fill</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {filteredBins.map((bin) => (
              <div key={bin.id} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border/30">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bin.fill > 90 ? "bg-destructive/10" : bin.fill > 70 ? "bg-accent/20" : "bg-primary/10"}`}>
                  <Trash2 className={`w-5 h-5 ${bin.fill > 90 ? "text-destructive" : bin.fill > 70 ? "text-accent-foreground" : "text-primary"}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-foreground">{bin.id}</p>
                    <Badge variant="secondary" className="text-xs bg-secondary text-secondary-foreground">{bin.type}</Badge>
                    {bin.online ? (
                      <Wifi className="w-3 h-3 text-primary" />
                    ) : (
                      <WifiOff className="w-3 h-3 text-destructive" />
                    )}
                    {bin.fill > 90 && (
                      <AlertTriangle className="w-3 h-3 text-destructive" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" /> {bin.location}
                  </div>
                </div>

                <div className="w-32 flex flex-col gap-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{getFillLabel(bin.fill)}</span>
                    <span className="font-medium text-foreground">{bin.fill}%</span>
                  </div>
                  <Progress value={bin.fill} className={`h-2 bg-secondary ${getFillBarColor(bin.fill)}`} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
