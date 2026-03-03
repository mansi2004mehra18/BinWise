"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardOverview } from "@/components/dashboard-overview"
import { CitizenPortal } from "@/components/citizen-portal"
import { QrScanner } from "@/components/qr-scanner"
import { RewardPoints } from "@/components/reward-points"
import { BinMonitor } from "@/components/bin-monitor"
import { BinMap } from "@/components/bin-map"
import { RouteOptimizer } from "@/components/route-optimizer"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const sections: Record<string, React.ComponentType> = {
  dashboard: DashboardOverview,
  citizen: CitizenPortal,
  qr: QrScanner,
  rewards: RewardPoints,
  bins: BinMonitor,
  map: BinMap,
  routes: RouteOptimizer,
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const ActiveComponent = sections[activeSection] || DashboardOverview

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AppSidebar activeSection={activeSection} onNavigate={setActiveSection} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-60">
            <AppSidebar
              activeSection={activeSection}
              onNavigate={(section) => {
                setActiveSection(section)
                setMobileMenuOpen(false)
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center gap-3 p-4 border-b border-border bg-card">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
            className="text-foreground"
          >
            <Menu className="w-5 h-5" />
            <span className="sr-only">Open menu</span>
          </Button>
          <span className="font-display text-lg font-bold text-foreground">EcoTrack</span>
        </div>

        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <ActiveComponent />
        </div>
      </main>
    </div>
  )
}
