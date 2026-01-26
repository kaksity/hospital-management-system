"use client";

import { useState } from "react";

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

const dataPoints = [
  { id: "revenue", label: "Total Revenue", value: 3450000, previousValue: 3100000 },
  { id: "invoices", label: "Total Invoices", value: 4200000, previousValue: 3800000 },
  { id: "cash", label: "Revenue by Cash", value: 850000, previousValue: 720000 },
  { id: "bank", label: "Revenue by Bank", value: 1200000, previousValue: 1100000 },
  { id: "card", label: "Revenue by Card", value: 1400000, previousValue: 1280000 },
  { id: "balance", label: "Outstanding Balance", value: 750000, previousValue: 900000 },
  { id: "patient_revenue", label: "New Patients Revenue", value: 450000, previousValue: 400000 },
  { id: "refunds", label: "Refunds", value: 45000, previousValue: 52000 },
];

export default function Insights() {
  const [selectedPoint, setSelectedPoint] = useState(dataPoints[0]);

  const handlePointChange = (id: string) => {
    const point = dataPoints.find(p => p.id === id);
    if (point) setSelectedPoint(point);
  };
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
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Strategic analytics and performance metrics for CarePak Diagnostics.</p>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="6months">
                <SelectTrigger className="w-[160px] h-9 bg-white border shadow-none font-semibold text-xs">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
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
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 leading-none">{stat.label}</p>
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

      <div className="p-6 space-y-8">
        {/* Main Analytics Section */}
        <div className="space-y-6">
          <Card className="border shadow-none rounded-2xl overflow-hidden bg-white">
            <CardContent className="py-6 px-6 md:p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Select value={selectedPoint.id} onValueChange={handlePointChange}>
                      <SelectTrigger className="h-auto p-0 border-none shadow-none focus:ring-0 bg-transparent text-slate-500 font-bold uppercase tracking-widest text-[11px] flex gap-2 items-center hover:text-slate-900 transition-colors w-fit">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {dataPoints.map(p => (
                          <SelectItem key={p.id} value={p.id} className="text-xs font-bold uppercase tracking-wider">{p.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="h-4 w-px bg-slate-200" />

                    <Select defaultValue="30days">
                      <SelectTrigger className="h-auto p-0 border-none shadow-none focus:ring-0 bg-transparent text-slate-400 font-bold uppercase tracking-widest text-[10px] flex gap-2 items-center hover:text-slate-700 transition-colors w-fit">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30days" className="text-xs font-bold uppercase tracking-wider">Last 30 Days</SelectItem>
                        <SelectItem value="90days" className="text-xs font-bold uppercase tracking-wider">Last 90 Days</SelectItem>
                        <SelectItem value="1year" className="text-xs font-bold uppercase tracking-wider">Last 1 Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <div className="text-2xl font-semibold text-slate-800 tabular-nums flex items-baseline gap-2">
                      {formatCurrency(selectedPoint.value)}
                      <div className={cn(
                        "flex items-center text-[11px] font-bold px-1.5 py-0.5 rounded-full",
                        selectedPoint.value >= selectedPoint.previousValue ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
                      )}>
                        {selectedPoint.value >= selectedPoint.previousValue ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                        {Math.abs(((selectedPoint.value - selectedPoint.previousValue) / selectedPoint.previousValue) * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-[11px] uppercase font-semibold text-slate-500 tracking-wider">
                      vs. <span className="font-mono">{formatCurrency(selectedPoint.previousValue)}</span> last 30 days
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-white p-3 rounded-xl border">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    <span className="text-slate-600">{selectedPoint.label}</span>
                  </div>
                  <div className="w-px h-3 bg-slate-200" />
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-slate-600">Patient Volume</span>
                  </div>
                </div>
              </div>

              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorSecondary" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fontWeight: 400, fill: '#64748b' }}
                      dy={10}
                    />
                    <YAxis
                      hide={true}
                    />
                    <RechartsTooltip
                      cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                      contentStyle={{
                        borderRadius: '16px',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                        padding: '12px'
                      }}
                      itemStyle={{ fontSize: '12px', fontWeight: 400 }}
                      labelStyle={{ marginBottom: '2px', color: '#94a3b8', fontSize: '10px', fontWeight: 400, textTransform: 'capitalize' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name={selectedPoint.label}
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorMain)"
                      animationDuration={1500}
                    />
                    <Area
                      type="monotone"
                      dataKey="referrals"
                      name="Patient Volume"
                      stroke="#10b981"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      fillOpacity={1}
                      fill="url(#colorSecondary)"
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Modality Distribution */}
          <Card className="border shadow-none rounded-2xl overflow-hidden bg-white">
            <CardHeader className="border-b bg-slate-50/50 flex flex-row items-center justify-between py-4 px-6 space-y-0">
              <div>
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-700">Category Mix</CardTitle>
                <CardDescription className="text-[11px] font-medium text-slate-500">Volume distribution by device type</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="h-[240px] w-full md:w-1/2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={modalityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={90}
                        paddingAngle={10}
                        dataKey="value"
                        animationDuration={1500}
                      >
                        {modalityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 space-y-3">
                  {modalityData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{item.name}</span>
                      </div>
                      <span className="text-sm font-black text-slate-800 tabular-nums">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Insight Card Placeholder */}
          <Card className="border shadow-none rounded-2xl overflow-hidden bg-white border-dashed flex flex-col items-center justify-center p-8 text-center bg-slate-50/30">
            <div className="h-12 w-12 rounded-full bg-white border shadow-sm flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-slate-400" />
            </div>
            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-widest">More Insights Coming</h4>
            <p className="text-xs text-slate-500 max-w-[240px] mt-1 font-medium italic">We're currently processing advanced referral patterns and patient retention metrics.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
