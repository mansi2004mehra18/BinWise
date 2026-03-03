"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Lock, LogIn, UserPlus, Eye, EyeOff } from "lucide-react"

export function CitizenPortal() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")

  if (isLoggedIn) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Welcome, {userName || "Citizen"}</h1>
            <p className="text-muted-foreground mt-1">Manage your waste deposits and track your environmental impact.</p>
          </div>
          <Button variant="outline" onClick={() => setIsLoggedIn(false)} className="border-border text-foreground hover:bg-secondary">
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-5 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 mx-auto flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold font-display text-foreground mt-3">ECO-2847</p>
              <p className="text-sm text-muted-foreground">Citizen ID</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-5 text-center">
              <div className="w-12 h-12 rounded-xl bg-accent/20 mx-auto flex items-center justify-center">
                <span className="text-lg font-bold text-accent-foreground">87%</span>
              </div>
              <p className="text-2xl font-bold font-display text-foreground mt-3">87%</p>
              <p className="text-sm text-muted-foreground">Segregation Efficiency</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-5 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 mx-auto flex items-center justify-center">
                <span className="text-lg font-bold text-primary">A+</span>
              </div>
              <p className="text-2xl font-bold font-display text-foreground mt-3">Level A+</p>
              <p className="text-sm text-muted-foreground">Eco Rating</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-lg">Recent Deposits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {[
                { id: "DEP-001", type: "Organic", weight: "2.5 kg", date: "Today, 9:30 AM", status: "Verified" },
                { id: "DEP-002", type: "Recyclable", weight: "1.8 kg", date: "Yesterday, 4:15 PM", status: "Verified" },
                { id: "DEP-003", type: "E-Waste", weight: "0.5 kg", date: "Mar 1, 11:00 AM", status: "Pending" },
                { id: "DEP-004", type: "Organic", weight: "3.2 kg", date: "Feb 28, 8:45 AM", status: "Verified" },
                { id: "DEP-005", type: "Recyclable", weight: "2.1 kg", date: "Feb 27, 3:20 PM", status: "Verified" },
              ].map((deposit) => (
                <div key={deposit.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">{deposit.type.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{deposit.type} - {deposit.weight}</p>
                      <p className="text-xs text-muted-foreground">{deposit.date}</p>
                    </div>
                  </div>
                  <Badge variant={deposit.status === "Verified" ? "default" : "secondary"} className={deposit.status === "Verified" ? "bg-primary text-primary-foreground" : ""}>
                    {deposit.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md border-border/50">
        <CardHeader className="text-center pb-2">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 mx-auto flex items-center justify-center mb-3">
            <User className="w-7 h-7 text-primary" />
          </div>
          <CardTitle className="font-display text-2xl">Citizen Portal</CardTitle>
          <p className="text-sm text-muted-foreground">Access your eco-dashboard</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 bg-secondary">
              <TabsTrigger value="login" className="text-secondary-foreground data-[state=active]:bg-card data-[state=active]:text-foreground">Login</TabsTrigger>
              <TabsTrigger value="register" className="text-secondary-foreground data-[state=active]:bg-card data-[state=active]:text-foreground">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-4">
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault()
                  setIsLoggedIn(true)
                }}
              >
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="citizen@ecotrack.com" className="pl-10 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="password" className="text-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      className="pl-10 pr-10 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <LogIn className="w-4 h-4 mr-2" /> Sign In
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="register" className="mt-4">
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  setUserName(formData.get("name") as string)
                  setIsLoggedIn(true)
                }}
              >
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="text-foreground">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="name" name="name" placeholder="John Doe" className="pl-10 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="reg-email" className="text-foreground">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="reg-email" type="email" placeholder="citizen@ecotrack.com" className="pl-10 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="reg-password" className="text-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
                      className="pl-10 pr-10 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <UserPlus className="w-4 h-4 mr-2" /> Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
