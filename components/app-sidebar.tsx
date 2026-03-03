"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Leaf,
  Users,
  Trash2,
  MapPin,
  BarChart3,
  Route,
  QrCode,
  Trophy,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navItems = [
  { label: "Dashboard", icon: BarChart3, section: "dashboard" },
  { label: "Citizen Portal", icon: Users, section: "citizen" },
  { label: "QR Scanner", icon: QrCode, section: "qr" },
  { label: "Reward Points", icon: Trophy, section: "rewards" },
  { label: "Bin Monitor", icon: Trash2, section: "bins" },
  { label: "Bin Map", icon: MapPin, section: "map" },
  { label: "Route Optimizer", icon: Route, section: "routes" },
]

interface AppSidebarProps {
  activeSection: string
  onNavigate: (section: string) => void
}

export function AppSidebar({ activeSection, onNavigate }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 h-screen sticky top-0",
          collapsed ? "w-16" : "w-60"
        )}
      >
        <div className={cn("flex items-center gap-3 px-4 h-16 border-b border-sidebar-border", collapsed && "justify-center")}>
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sidebar-primary">
            <Leaf className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-display text-lg font-bold tracking-tight text-sidebar-foreground">
              EcoTrack
            </span>
          )}
        </div>

        <nav className="flex-1 py-4 px-2 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.section
            const button = (
              <button
                key={item.section}
                onClick={() => onNavigate(item.section)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5 shrink-0", isActive && "text-sidebar-primary")} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            )

            if (collapsed) {
              return (
                <Tooltip key={item.section}>
                  <TooltipTrigger asChild>{button}</TooltipTrigger>
                  <TooltipContent side="right" className="bg-sidebar text-sidebar-foreground border-sidebar-border">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return button
          })}
        </nav>

        <div className="p-2 border-t border-sidebar-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!collapsed && <span className="ml-2 text-xs">Collapse</span>}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
