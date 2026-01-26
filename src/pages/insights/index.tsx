"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  Download
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { formatCurrency } from '@/utils/formatCurrency';
import { cn } from '@/lib/utils';

const revenueData = [
  { month: 'Jan', revenue: 450000, referrals: 120 },
  { month: 'Feb', revenue: 520000, referrals: 145 },
  { month: 'Mar', revenue: 480000, referrals: 132 },
  { month: 'Apr', revenue: 610000, referrals: 168 },
  { month: 'May', revenue: 590000, referrals: 155 },
  { month: 'Jun', revenue: 720000, referrals: 198 },
];

const modalityData = [
  { name: 'MRI', value: 45, color: '#3b82f6' },
  { name: 'CT Scan', value: 30, color: '#10b981' },
  { name: 'X-Ray', value: 15, color: '#f59e0b' },
  { name: 'Ultrasound', value: 10, color: '#ef4444' },
];

export default function Insights() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-slate-900">Operational Insights</h1>
                <Badge variant="secondary" className="h-6 px-2 text-[12px] font-bold bg-slate-100 text-slate-600 border-none rounded-md">
                  Live
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">Strategic analytics and performance metrics for CarePak Diagnostics.</p>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="6months">
                <SelectTrigger className="w-[160px] h-9 bg-white border shadow-none font-semibold text-xs">
                  <Calendar className="h-3.5 w-3.5 mr-2 text-slate-400" />
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2 h-9 font-bold bg-white">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Unified Summary Card */}
          <Card className="border shadow-none bg-white rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x border-slate-100">
              {[
                { label: "Total Revenue", value: "₦4.2M", trend: "+12.5%", positive: true, icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Patient Visits", value: "1,248", trend: "+8.2%", positive: true, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Avg. Turnaround", value: "4.2 hrs", trend: "-15.1%", positive: true, icon: Activity, color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Referral Growth", value: "24%", trend: "+2.4%", positive: true, icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" },
              ].map((stat, i) => (
                <div key={i} className="p-4 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-none">{stat.label}</p>
                    <div className="flex items-end gap-2 pt-1">
                      <h3 className="text-lg font-bold text-slate-800 tabular-nums leading-none">{stat.value}</h3>
                      <div className={cn("flex items-center text-[10px] font-bold leading-none mb-0.5", stat.positive ? "text-emerald-600" : "text-rose-600")}>
                        {stat.positive ? <ArrowUpRight className="h-2.5 w-2.5 mr-0.5" /> : <ArrowDownRight className="h-2.5 w-2.5 mr-0.5" />}
                        {stat.trend}
                      </div>
                    </div>
                  </div>
                  <div className={cn("p-2 rounded-xl transition-transform group-hover:scale-110", stat.bg)}>
                    <stat.icon className={cn("h-4 w-4", stat.color)} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="p-6 space-y-6">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Trend */}
          <Card className="lg:col-span-2 border shadow-none rounded-xl overflow-hidden bg-white">
            <CardHeader className="border-b bg-slate-50/50 flex flex-row items-center justify-between py-4 px-6">
              <div>
                <CardTitle className="text-sm font-bold text-slate-700">Revenue & Referral Trends</CardTitle>
                <CardDescription className="text-xs font-medium">Performance comparison across the last 6 months</CardDescription>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span>Revenue</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Referrals</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fontWeight: 500, fill: '#888' }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fontWeight: 500, fill: '#888' }}
                      tickFormatter={(value) => `₦${value / 1000}k`}
                    />
                    <RechartsTooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Modality Distribution */}
          <Card className="border shadow-none rounded-xl overflow-hidden bg-white">
            <CardHeader className="border-b bg-slate-50/50 py-4 px-6">
              <CardTitle className="text-sm font-bold text-slate-700">Modality Mix</CardTitle>
              <CardDescription className="text-xs font-medium">Volume distribution by device type</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={modalityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {modalityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 space-y-3">
                {modalityData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs font-bold text-slate-600">{item.name}</span>
                    </div>
                    <span className="text-xs font-black text-slate-800 tabular-nums">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
