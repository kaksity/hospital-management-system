"use client";

import { useState, useMemo } from "react";

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

const modalityData = [
  { name: 'CT Scan', value: 15, color: '#3b82f6' },
  { name: 'MRI', value: 12, color: '#10b981' },
  { name: 'Ultrasound', value: 10, color: '#f59e0b' },
  { name: 'General Radiograph (X-ray)', value: 18, color: '#ef4444' },
  { name: 'Fluroscopy', value: 4, color: '#8b5cf6' },
  { name: 'Endoscopy', value: 5, color: '#ec4899' },
  { name: 'Mammogram', value: 6, color: '#06b6d4' },
  { name: 'Digital Mammography', value: 8, color: '#f97316' },
  { name: 'Interventional Procedures', value: 4, color: '#6366f1' },
  { name: 'Breast Biopsy', value: 3, color: '#14b8a6' },
  { name: 'Breast Ultrasound', value: 5, color: '#a855f7' },
  { name: 'General Lab Tests', value: 10, color: '#64748b' },
];

const dataPoints = [
  { id: "revenue", label: "Total Revenue", value: 3450000, previousValue: 3100000, color: "#3b82f6" },
  { id: "invoices", label: "Total Invoices", value: 4200000, previousValue: 3800000, color: "#10b981" },
  { id: "cash", label: "Revenue by Cash", value: 850000, previousValue: 720000, color: "#f59e0b" },
  { id: "bank", label: "Revenue by Bank", value: 1200000, previousValue: 1100000, color: "#f59e0b" },
  { id: "card", label: "Revenue by Card", value: 1400000, previousValue: 1280000, color: "#f59e0b" },
  { id: "balance", label: "Outstanding Balance", value: 750000, previousValue: 900000, color: "#ef4444" },
  { id: "patient_revenue", label: "New Patients Revenue", value: 450000, previousValue: 400000, color: "#8b5cf6" },
  { id: "refunds", label: "Refunds", value: 45000, previousValue: 52000, color: "#64748b" },
];

export default function Insights() {
  const [selectedPoint, setSelectedPoint] = useState(dataPoints[0]);
  const [timeframe, setTimeframe] = useState("30days");

  const chartData = useMemo(() => {
    const data = [];
    const now = new Date();

    const getVariance = () => (Math.random() * 0.4) + 0.8; // random between 0.8 and 1.2
    const baseValue = selectedPoint.value / (timeframe === "12months" ? 12 : timeframe === "60days" ? 30 : timeframe === "30days" ? 30 : 7);

    if (timeframe === "7days") {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        data.push({
          label: date.toLocaleDateString(undefined, { weekday: 'short' }),
          value: Math.floor(baseValue * getVariance()),
        });
      }
    } else if (timeframe === "30days") {
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        data.push({
          label: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          value: Math.floor(baseValue * getVariance()),
        });
      }
    } else if (timeframe === "60days") {
      for (let i = 59; i >= 0; i -= 2) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        data.push({
          label: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          value: Math.floor(baseValue * getVariance() * 2), // * 2 because we skip days
        });
      }
    } else if (timeframe === "12months") {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 0; i < 12; i++) {
        data.push({
          label: months[i],
          value: Math.floor(baseValue * getVariance()),
        });
      }
    }
    return data;
  }, [timeframe, selectedPoint]);

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
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[160px] h-9 bg-white border shadow-none font-semibold text-xs">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="60days">Last 60 Days</SelectItem>
                  <SelectItem value="12months">Last 12 Months</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2 h-9 bg-white">
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
                      <SelectTrigger className="h-auto p-0 border-none shadow-none focus:ring-0 bg-transparent text-slate-700 font-semibold antialiased text-sm flex gap-2 items-center hover:text-slate-800 transition-colors w-fit">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {dataPoints.map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="h-4 w-px bg-slate-200" />

                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger className="h-auto p-0 border-none shadow-none focus:ring-0 bg-transparent text-slate-700 font-semibold antialiased text-sm flex gap-2 items-center hover:text-slate-800 transition-colors w-fit">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7days">Last 7 Days</SelectItem>
                        <SelectItem value="30days">Last 30 Days</SelectItem>
                        <SelectItem value="60days">Last 60 Days</SelectItem>
                        <SelectItem value="12months">Last 12 Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <div className="text-2xl font-semibold text-slate-800 tabular-nums flex items-baseline gap-2">
                      {formatCurrency(selectedPoint.value)}
                      <div className={cn(
                        "flex items-center text-[11px]",
                        selectedPoint.value >= selectedPoint.previousValue ? "text-emerald-600" : "text-rose-600"
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
                    <div
                      className="h-2 w-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.2)]"
                      style={{ backgroundColor: selectedPoint.color, boxShadow: `0 0 8px ${selectedPoint.color}80` }}
                    />
                    <span className="text-slate-600">{selectedPoint.label}</span>
                  </div>
                </div>
              </div>

              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barGap={timeframe === '30days' ? 8 : timeframe === '60days' ? 6 : 24}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fontWeight: 400, fill: '#64748b' }}
                      dy={10}
                      interval={timeframe === '30days' ? 4 : timeframe === '60days' ? 6 : 0}
                    />
                    <YAxis
                      hide={true}
                    />
                    <RechartsTooltip
                      cursor={{ fill: '#f8fafc', opacity: 0.4 }}
                      contentStyle={{
                        borderRadius: '16px',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                        padding: '12px'
                      }}
                      itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                      labelStyle={{ marginBottom: '0', color: '#4b4f54ff', fontSize: '12px', fontWeight: 400, textTransform: 'capitalize' }}
                    />
                    <Bar
                      dataKey="value"
                      name={selectedPoint.label}
                      fill={selectedPoint.color}
                      radius={[4, 4, 0, 0]}
                      barSize={timeframe === '7days' ? 120 : timeframe === '30days' ? 32 : timeframe === '60days' ? 20 : 80}
                      animationDuration={1500}
                    />
                  </BarChart>
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
                        innerRadius={60}
                        outerRadius={95}
                        paddingAngle={4}
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
                <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {modalityData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight truncate">{item.name}</span>
                      </div>
                      <span className="text-xs font-black text-slate-800 tabular-nums ml-2">{item.value}%</span>
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
            <p className="text-xs text-slate-500 max-w-[240px] mt-1 font-medium">We're currently processing advanced referral patterns and patient retention metrics.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
