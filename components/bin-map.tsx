"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Loader2, Trash2, AlertTriangle } from "lucide-react"


interface BinLocation {
  id: string
  lat: number
  lng: number
  fill: number
  type: string
  location: string
}

const binLocations: BinLocation[] = [
  { id: "BIN-A01", lat: 12.9716, lng: 77.5946, fill: 92, type: "Organic", location: "MG Road, Central" },
  { id: "BIN-A02", lat: 12.9784, lng: 77.5901, fill: 67, type: "Recyclable", location: "Cubbon Park Gate" },
  { id: "BIN-B01", lat: 12.9352, lng: 77.6245, fill: 45, type: "General", location: "Koramangala 5th Block" },
  { id: "BIN-B02", lat: 12.9562, lng: 77.6012, fill: 88, type: "Organic", location: "Lalbagh West Gate" },
  { id: "BIN-C01", lat: 12.9856, lng: 77.5473, fill: 31, type: "E-Waste", location: "Rajajinagar Industrial" },
  { id: "BIN-C02", lat: 12.9698, lng: 77.6412, fill: 95, type: "Recyclable", location: "Indiranagar 100ft Rd" },
  { id: "BIN-D01", lat: 12.9443, lng: 77.5690, fill: 73, type: "General", location: "Basavanagudi Circle" },
  { id: "BIN-D02", lat: 12.9821, lng: 77.5714, fill: 56, type: "Organic", location: "Malleshwaram 8th Cross" },
  { id: "BIN-E01", lat: 12.9610, lng: 77.5380, fill: 41, type: "Hazardous", location: "Vijayanagar Hospital" },
  { id: "BIN-E02", lat: 12.9290, lng: 77.5850, fill: 84, type: "Recyclable", location: "Jayanagar 4th Block" },
]

const DEPOT = { lat: 12.9550, lng: 77.5870, label: "Collection Depot" }

function getMarkerColor(fill: number) {
  if (fill > 90) return "#dc2626"
  if (fill > 70) return "#d97706"
  return "#16a34a"
}

function getStatusLabel(fill: number) {
  if (fill > 90) return "Critical"
  if (fill > 70) return "High"
  return "Normal"
}

export function BinMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const routeLayerRef = useRef<L.LayerGroup | null>(null)
  const [routeLoading, setRouteLoading] = useState(false)
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null)
  const [selectedBin, setSelectedBin] = useState<BinLocation | null>(null)
  const [routeTarget, setRouteTarget] = useState<BinLocation | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    let cancelled = false

    async function initMap() {
      const L = (await import("leaflet")).default

      if (cancelled || !mapRef.current) return

      // Fix default marker icons
      // delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      })

      const map = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView([12.9580, 77.5850], 13)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      // Depot marker
      const depotIcon = L.divIcon({
        className: "custom-depot-icon",
        html: `<div style="
          width: 36px; height: 36px; border-radius: 50%;
          background: #16a34a; border: 3px solid white;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3); color: white;
          font-weight: bold; font-size: 14px; font-family: sans-serif;
        ">D</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20],
      })

      L.marker([DEPOT.lat, DEPOT.lng], { icon: depotIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: sans-serif; padding: 4px;">
            <strong style="font-size: 14px;">Collection Depot</strong><br/>
            <span style="color: #16a34a; font-size: 12px;">Home Base</span>
          </div>
        `)

      // Bin markers
      binLocations.forEach((bin) => {
        const color = getMarkerColor(bin.fill)
        const status = getStatusLabel(bin.fill)
        const pulseRing = bin.fill > 90
          ? `<div style="
              position: absolute; top: -6px; left: -6px;
              width: 44px; height: 44px; border-radius: 50%;
              border: 2px solid ${color}; opacity: 0.5;
              animation: pulse 2s infinite;
            "></div>`
          : ""

        const icon = L.divIcon({
          className: "custom-bin-icon",
          html: `
            <div style="position: relative;">
              ${pulseRing}
              <div style="
                width: 32px; height: 32px; border-radius: 50%;
                background: ${color}; border: 2.5px solid white;
                display: flex; align-items: center; justify-content: center;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3); color: white;
                font-weight: bold; font-size: 11px; font-family: sans-serif;
              ">${bin.fill}%</div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18],
        })

        L.marker([bin.lat, bin.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: sans-serif; padding: 4px; min-width: 160px;">
              <strong style="font-size: 14px;">${bin.id}</strong>
              <span style="
                display: inline-block; margin-left: 6px; padding: 1px 6px;
                background: ${color}20; color: ${color}; border-radius: 4px;
                font-size: 11px; font-weight: 600;
              ">${status}</span>
              <br/>
              <span style="color: #6b7280; font-size: 12px;">${bin.location}</span><br/>
              <span style="font-size: 12px; margin-top: 4px; display: inline-block;">
                <strong>Fill:</strong> ${bin.fill}% &nbsp; <strong>Type:</strong> ${bin.type}
              </span>
            </div>
          `)
      })

      // Route layer
      routeLayerRef.current = L.layerGroup().addTo(map)

      // Pulse animation style
      const style = document.createElement("style")
      style.textContent = `
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.3); opacity: 0.2; }
          100% { transform: scale(1); opacity: 0.5; }
        }
      `
      document.head.appendChild(style)

      mapInstanceRef.current = map

      // Force a resize after mount
      setTimeout(() => map.invalidateSize(), 200)
    }

    initMap()

    return () => {
      cancelled = true
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  const fetchRoute = useCallback(async (bin: BinLocation) => {
    setRouteLoading(true)
    setRouteTarget(bin)
    setRouteInfo(null)

    try {
      const L = (await import("leaflet")).default

      // Clear previous route
      if (routeLayerRef.current) {
        routeLayerRef.current.clearLayers()
      }

      // OSRM route from depot to bin
      const coords = `${DEPOT.lng},${DEPOT.lat};${bin.lng},${bin.lat}`
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&steps=true`
      )
      const data = await response.json()

      if (data.code === "Ok" && data.routes.length > 0) {
        const route = data.routes[0]
        const geojson = route.geometry

        // Draw route line
        const routeLine = L.geoJSON(geojson, {
          style: {
            color: "#16a34a",
            weight: 5,
            opacity: 0.85,
            dashArray: undefined,
          },
        })

        if (routeLayerRef.current) {
          routeLayerRef.current.addLayer(routeLine)
        }

        // Fit bounds to route
        if (mapInstanceRef.current) {
          mapInstanceRef.current.fitBounds(routeLine.getBounds(), { padding: [50, 50] })
        }

        const distKm = (route.distance / 1000).toFixed(1)
        const durMin = Math.round(route.duration / 60)
        setRouteInfo({ distance: `${distKm} km`, duration: `${durMin} min` })
      }
    } catch {
      console.error("Failed to fetch route")
    } finally {
      setRouteLoading(false)
    }
  }, [])

  const fetchOptimalRoute = useCallback(async () => {
    setRouteLoading(true)
    setRouteTarget(null)
    setRouteInfo(null)

    try {
      const L = (await import("leaflet")).default

      if (routeLayerRef.current) {
        routeLayerRef.current.clearLayers()
      }

      // Get critical bins (fill > 70%) for the optimal collection route
      const criticalBins = binLocations
        .filter((b) => b.fill > 70)
        .sort((a, b) => b.fill - a.fill)

      // Build coordinates: depot -> all critical bins -> depot
      const waypoints = [
        `${DEPOT.lng},${DEPOT.lat}`,
        ...criticalBins.map((b) => `${b.lng},${b.lat}`),
        `${DEPOT.lng},${DEPOT.lat}`,
      ].join(";")

      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${waypoints}?overview=full&geometries=geojson&steps=true`
      )
      const data = await response.json()

      if (data.code === "Ok" && data.routes.length > 0) {
        const route = data.routes[0]

        // Draw main route
        const routeLine = L.geoJSON(route.geometry, {
          style: {
            color: "#16a34a",
            weight: 5,
            opacity: 0.9,
          },
        })

        if (routeLayerRef.current) {
          routeLayerRef.current.addLayer(routeLine)

          // Add numbered stop markers along the route
          criticalBins.forEach((bin, i) => {
            const stopIcon = L.divIcon({
              className: "route-stop-icon",
              html: `<div style="
                width: 22px; height: 22px; border-radius: 50%;
                background: #16a34a; color: white; border: 2px solid white;
                display: flex; align-items: center; justify-content: center;
                font-size: 11px; font-weight: bold; font-family: sans-serif;
                box-shadow: 0 1px 4px rgba(0,0,0,0.3);
              ">${i + 1}</div>`,
              iconSize: [22, 22],
              iconAnchor: [11, 11],
            })
            const marker = L.marker([bin.lat, bin.lng], { icon: stopIcon })
            routeLayerRef.current!.addLayer(marker)
          })
        }

        if (mapInstanceRef.current) {
          mapInstanceRef.current.fitBounds(routeLine.getBounds(), { padding: [50, 50] })
        }

        const distKm = (route.distance / 1000).toFixed(1)
        const durMin = Math.round(route.duration / 60)
        setRouteInfo({
          distance: `${distKm} km`,
          duration: `${durMin} min`,
        })
      }
    } catch {
      console.error("Failed to fetch optimal route")
    } finally {
      setRouteLoading(false)
    }
  }, [])

  const clearRoute = useCallback(() => {
    if (routeLayerRef.current) {
      routeLayerRef.current.clearLayers()
    }
    setRouteInfo(null)
    setRouteTarget(null)
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([12.9580, 77.5850], 13)
    }
  }, [])

  const criticalBins = binLocations.filter((b) => b.fill > 70).sort((a, b) => b.fill - a.fill)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Bin Map
          </h1>
          <p className="text-muted-foreground mt-1">
            Live GPS map with real-time routing and shortest distance paths.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={fetchOptimalRoute}
            disabled={routeLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {routeLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4 mr-2" />
                Optimal Collection Route
              </>
            )}
          </Button>
          {routeInfo && (
            <Button
              variant="outline"
              onClick={clearRoute}
              className="border-border text-foreground hover:bg-secondary"
            >
              Clear Route
            </Button>
          )}
        </div>
      </div>

      {/* Route info banner */}
      {routeInfo && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {routeTarget ? `Route to ${routeTarget.id}` : "Optimal Collection Route"}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Badge className="bg-primary/10 text-primary border-primary/20 text-sm px-3 py-1">
                  {routeInfo.distance}
                </Badge>
                <Badge variant="secondary" className="bg-secondary text-secondary-foreground text-sm px-3 py-1">
                  ~{routeInfo.duration}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                Shortest path via OSRM road network routing
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interactive Map */}
      <Card className="border-border/50">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="font-display text-lg">City Overview - Bengaluru</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#16a34a" }} />
              <span className="text-xs text-muted-foreground">{"Normal (<70%)"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#d97706" }} />
              <span className="text-xs text-muted-foreground">{"High (70-90%)"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#dc2626" }} />
              <span className="text-xs text-muted-foreground">{"Critical (>90%)"}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
          />
          <div className="rounded-xl overflow-hidden border border-border/50">
            <div ref={mapRef} style={{ height: 480, width: "100%" }} />
          </div>
        </CardContent>
      </Card>

      {/* Critical bins with route buttons */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-destructive" />
          Priority Collection Bins
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {criticalBins.map((bin) => (
            <Card
              key={bin.id}
              className={`border-border/50 ${
                bin.fill > 90
                  ? "border-l-4 border-l-destructive"
                  : "border-l-4 border-l-accent"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{bin.id}</span>
                  <Badge
                    className={
                      bin.fill > 90
                        ? "bg-destructive/10 text-destructive border-destructive/20"
                        : "bg-accent/20 text-accent-foreground border-accent/30"
                    }
                  >
                    {bin.fill}%
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" /> {bin.location}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <Badge
                    variant="secondary"
                    className="text-xs bg-secondary text-secondary-foreground"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    {bin.type}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fetchRoute(bin)}
                    disabled={routeLoading}
                    className="text-xs h-7 px-2 text-primary hover:text-primary hover:bg-primary/10"
                  >
                    <Navigation className="w-3 h-3 mr-1" />
                    Route
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
