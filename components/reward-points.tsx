"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Gift, Target, Zap, Crown } from "lucide-react"

const rewards = [
  { name: "Eco Starter", points: 100, icon: Star, earned: true, description: "Complete 10 waste deposits" },
  { name: "Green Warrior", points: 500, icon: Zap, earned: true, description: "Maintain 80%+ segregation for 30 days" },
  { name: "Recycle Champion", points: 1000, icon: Trophy, earned: true, description: "Recycle 50kg of waste" },
  { name: "Carbon Saver", points: 2000, icon: Target, earned: false, description: "Save 100kg of CO2 emissions" },
  { name: "Eco Master", points: 5000, icon: Crown, earned: false, description: "Reach Level A+ citizen rating" },
]

const redeemableRewards = [
  { name: "Bus Pass (1 Day)", points: 200, category: "Transport" },
  { name: "Grocery Discount 10%", points: 350, category: "Shopping" },
  { name: "Park Entry Ticket", points: 150, category: "Leisure" },
  { name: "Movie Ticket", points: 500, category: "Entertainment" },
  { name: "Electricity Bill Credit", points: 1000, category: "Utility" },
  { name: "Gym Day Pass", points: 300, category: "Fitness" },
]

export function RewardPoints() {
  const totalPoints = 1640
  const nextMilestone = 2000
  const progressPercent = (totalPoints / nextMilestone) * 100

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Reward Points</h1>
        <p className="text-muted-foreground mt-1">Earn points for responsible waste management and redeem exciting rewards.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-4xl font-bold font-display text-primary">{totalPoints.toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Trophy className="w-7 h-7 text-primary" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress to next milestone</span>
                <span className="font-medium text-foreground">{totalPoints} / {nextMilestone}</span>
              </div>
              <Progress value={progressPercent} className="h-3 bg-secondary [&>div]:bg-primary" />
              <p className="text-xs text-muted-foreground">{nextMilestone - totalPoints} points to Carbon Saver badge</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-3">
              <span className="text-lg font-bold text-accent-foreground">#12</span>
            </div>
            <p className="text-2xl font-bold font-display text-foreground">Rank #12</p>
            <p className="text-sm text-muted-foreground">In your neighborhood</p>
            <Badge className="mt-2 bg-primary text-primary-foreground">Top 5%</Badge>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="font-display text-lg">Achievement Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {rewards.map((reward) => (
              <div
                key={reward.name}
                className={`flex flex-col items-center text-center p-4 rounded-xl border transition-colors ${
                  reward.earned
                    ? "bg-primary/5 border-primary/20"
                    : "bg-secondary/30 border-border/30 opacity-60"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${reward.earned ? "bg-primary/10" : "bg-muted"}`}>
                  <reward.icon className={`w-6 h-6 ${reward.earned ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <p className="text-sm font-medium text-foreground">{reward.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{reward.description}</p>
                <Badge variant="secondary" className="mt-2 text-xs bg-secondary text-secondary-foreground">{reward.points} pts</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" /> Redeem Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {redeemableRewards.map((reward) => (
              <div key={reward.name} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border/30">
                <div>
                  <p className="text-sm font-medium text-foreground">{reward.name}</p>
                  <Badge variant="secondary" className="mt-1 text-xs bg-secondary text-secondary-foreground">{reward.category}</Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold font-display text-primary">{reward.points}</p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
