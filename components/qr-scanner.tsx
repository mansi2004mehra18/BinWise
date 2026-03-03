"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QrCode, Camera, CheckCircle2, XCircle, RotateCcw } from "lucide-react"

const scanHistory = [
  { id: "QR-7291", bin: "Bin A-12", type: "Organic", location: "Sector 5, Main Road", time: "2 min ago", valid: true },
  { id: "QR-7290", bin: "Bin B-08", type: "Recyclable", location: "Sector 3, Park Ave", time: "1 hour ago", valid: true },
  { id: "QR-7289", bin: "Bin C-03", type: "E-Waste", location: "Sector 7, Tech Park", time: "3 hours ago", valid: false },
  { id: "QR-7288", bin: "Bin A-05", type: "Organic", location: "Sector 1, Market St", time: "Yesterday", valid: true },
]

export function QrScanner() {
  const [scanning, setScanning] = useState(false)
  const [scanned, setScanned] = useState(false)

  const handleScan = () => {
    setScanning(true)
    setTimeout(() => {
      setScanning(false)
      setScanned(true)
    }, 2000)
  }

  const resetScan = () => {
    setScanned(false)
    setScanning(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">QR Scanner</h1>
        <p className="text-muted-foreground mt-1">Scan bin QR codes to log your waste deposits and earn points.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-lg">Scan QR Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-full aspect-square max-w-xs rounded-2xl border-2 border-dashed border-border bg-secondary/30 flex items-center justify-center overflow-hidden">
                {scanning ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground">Scanning...</p>
                  </div>
                ) : scanned ? (
                  <div className="flex flex-col items-center gap-3 p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-foreground text-lg">Scan Successful</p>
                      <p className="text-sm text-muted-foreground mt-1">Bin A-12 | Organic Waste</p>
                      <p className="text-sm text-muted-foreground">Sector 5, Main Road</p>
                    </div>
                    <Badge className="bg-primary text-primary-foreground">+15 Points Earned</Badge>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-center p-6">
                    <QrCode className="w-16 h-16 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">Position QR code within the frame</p>
                  </div>
                )}

                {!scanned && !scanning && (
                  <>
                    <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                    <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-lg" />
                    <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-lg" />
                    <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-lg" />
                  </>
                )}
              </div>

              <div className="flex gap-3">
                {scanned ? (
                  <Button onClick={resetScan} variant="outline" className="border-border text-foreground hover:bg-secondary">
                    <RotateCcw className="w-4 h-4 mr-2" /> Scan Another
                  </Button>
                ) : (
                  <Button onClick={handleScan} disabled={scanning} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Camera className="w-4 h-4 mr-2" /> {scanning ? "Scanning..." : "Start Scan"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-lg">Scan History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {scanHistory.map((scan) => (
                <div key={scan.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/30">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${scan.valid ? "bg-primary/10" : "bg-destructive/10"}`}>
                      {scan.valid ? (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      ) : (
                        <XCircle className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{scan.bin} - {scan.type}</p>
                      <p className="text-xs text-muted-foreground">{scan.location}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{scan.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
