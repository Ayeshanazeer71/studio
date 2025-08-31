"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Activity, ScanLine, ShieldCheck, ShieldX } from "lucide-react"

const chartData = [
  { name: "Sun", total: Math.floor(Math.random() * 2000) + 500 },
  { name: "Mon", total: Math.floor(Math.random() * 2000) + 500 },
  { name: "Tue", total: Math.floor(Math.random() * 2000) + 500 },
  { name: "Wed", total: Math.floor(Math.random() * 2000) + 500 },
  { name: "Thu", total: Math.floor(Math.random() * 2000) + 500 },
  { name: "Fri", total: Math.floor(Math.random() * 2000) + 500 },
  { name: "Sat", total: Math.floor(Math.random() * 2000) + 500 },
]

const recentActivities = [
    { type: 'URL', value: 'http://evil-site.com', status: 'Phishing', date: '2 mins ago' },
    { type: 'APK', value: 'com.malware.app', status: 'Malicious', date: '5 mins ago' },
    { type: 'URL', value: 'http://safe-site.com', status: 'Safe', date: '10 mins ago' },
    { type: 'APK', value: 'com.game.fun', status: 'Safe', date: '23 mins ago' },
    { type: 'URL', value: 'http://get-free-stuff.net', status: 'Phishing', date: '1 hour ago' },
]

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <ScanLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,543</div>
            <p className="text-xs text-muted-foreground">
              +12.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threats Found</CardTitle>
            <ShieldX className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">
              +23% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safe Entities</CardTitle>
            <ShieldCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,201</div>
            <p className="text-xs text-muted-foreground">
              97.3% success rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Scan Activity</CardTitle>
            <CardDescription>Scans performed in the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              A log of the most recent scans.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.map((activity, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Badge variant="outline">{activity.type}</Badge>
                    </TableCell>
                    <TableCell className="font-medium truncate max-w-48">{activity.value}</TableCell>
                    <TableCell>
                       <Badge variant={activity.status === 'Safe' ? 'secondary' : 'destructive'}>{activity.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{activity.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
