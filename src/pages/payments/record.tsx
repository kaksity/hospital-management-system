/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CreditCard,
  Landmark,
  Wallet,
  Tag,
  Calculator,
  ArrowLeft,
  CheckCircle2,
  Calendar as CalendarIcon,
  Receipt,
  Scan,
  User,
  BadgeInfo
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatCurrency";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarInitials, getPatientAvatarPath, getAvatarBg } from "@/utils/avatarUtils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { payments } from "@/data/payments";

const INCOME_ACCOUNTS = [
  { name: "MRI Services", code: "ACC-4001" },
  { name: "CT SCAN Services", code: "ACC-4002" },
  { name: "X-RAY Services", code: "ACC-4003" },
  { name: "ULTRASOUND Services", code: "ACC-4004" },
  { name: "Lab Services", code: "ACC-4005" },
  { name: "Pharmacy Services", code: "ACC-4006" },
  { name: "Consultation Fees", code: "ACC-4007" },
];

const PAYMENT_METHODS = [
  { value: "bank_transfer", label: "Bank Transfer", icon: Landmark },
  { value: "card", label: "Debit/Credit Card", icon: CreditCard },
  { value: "cash", label: "Cash Payment", icon: Wallet },
];

export default function RecordPaymentPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const client = useMemo(() => payments.find(p => p.id === id), [id]);

  const [paymentDate, setPaymentDate] = useState<Date>(new Date());
  const [paymentMethod, setPaymentMethod] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [reference, setReference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize line items from client services
  const [lineItems, setLineItems] = useState<any[]>([]);

  useEffect(() => {
    if (client && client.services) {
      setLineItems(client.services.map((s: any) => ({
        ...s,
        payingAmount: 0,
        incomeAccount: "",
        accountCode: ""
      })));
    }
  }, [client]);

  const totalPaying = useMemo(() => {
    return lineItems.reduce((sum, item) => sum + (parseFloat(item.payingAmount) || 0), 0);
  }, [lineItems]);

  const remainingBalance = useMemo(() => {
    if (!client) return 0;
    return Math.max(0, client.balance - totalPaying);
  }, [client, totalPaying]);

  const handleLineItemChange = (index: number, field: string, value: any) => {
    const newItems = [...lineItems];
    if (field === 'incomeAccount') {
      const account = INCOME_ACCOUNTS.find(a => a.name === value);
      newItems[index].incomeAccount = value;
      newItems[index].accountCode = account ? account.code : "";
    } else {
      newItems[index][field] = value;
    }
    setLineItems(newItems);
  };

  const handleRecord = () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    if (totalPaying <= 0) {
      toast.error("Please record an amount for at least one service");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Payment recorded successfully");
      navigate("/payments");
    }, 1500);
  };

  if (!client) return (
    <div className="p-20 text-center">
      <h2 className="text-xl font-bold">Transaction not found</h2>
      <Button onClick={() => navigate("/payments")} className="mt-4">Back to Payments</Button>
    </div>
  );

  return (
    <div className="min-h-full flex flex-col bg-[#fafafa]">
      <div className="max-w-4xl mx-auto w-full p-6 pb-20 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 leading-none">Record New Payment</h1>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mt-1.5 tabular-nums">TRANS ID: {client.id} • {format(new Date(), "MMM dd, yyyy")}</p>
          </div>
          <Badge className="bg-slate-200 text-slate-700 hover:bg-slate-200 border-none px-3 font-bold uppercase tracking-wider">
            Invoice: {client.invoiceNo || "N/A"}
          </Badge>
        </div>

        <div className="grid gap-8">
          {/* Patient Profile Section */}
          <Card className="rounded-2xl bg-white overflow-hidden border-input-50">
            <CardContent className="p-0 border-t-4 border-primary">
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-slate-50 shadow-sm">
                    <AvatarImage src={getPatientAvatarPath(client.patientId, client.gender)} />
                    <AvatarFallback className={cn("text-lg font-bold", getAvatarBg(client.patientName))}>
                      {getAvatarInitials(client.patientName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h2 className="font-semibold text-slate-900 leading-none">{client.patientName}</h2>
                    <div className="flex items-center gap-2">
                      <code className="text-[11px] font-semibold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10 uppercase tracking-tighter">
                        {client.patientId}
                      </code>
                      <div className="h-1 w-1 rounded-full bg-slate-300" />
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{client.patientType} Patient</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 pr-4">
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Outstanding Balance</p>
                    <p className="text-xl font-black text-rose-600 tabular-nums">{formatCurrency(client.balance)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items Section */}
          <Card className="rounded-2xl bg-white overflow-hidden border-input-50">
            <CardContent className="p-0">
              <div className="p-5 border-b flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Scan className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-800">Diagnostic Scans & Allocation</h2>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest leading-none mt-0.5">Allocate payment to specific procedures</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent transition-none border-b">
                      <TableHead className="text-[11px] font-bold uppercase text-slate-500 h-11 pl-6">Exam Name</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase text-slate-500 h-11">Exam Type</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase text-slate-500 h-11 w-[180px]">Income Account</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase text-slate-500 h-11 w-[120px]">Account Code</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase text-slate-500 h-11 text-right pr-6 w-[180px]">Amount To Record</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lineItems.map((item, idx) => (
                      <TableRow key={idx} className="hover:bg-slate-50/20 transition-colors border-b last:border-0 h-16">
                        <TableCell className="pl-6">
                          <p className="text-[13px] font-bold text-slate-800 leading-none">{item.name}</p>
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Fee: {formatCurrency(item.price)}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] font-bold bg-slate-50 text-slate-500 border-slate-200 h-6">
                            {item.category || "General"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select value={item.incomeAccount} onValueChange={(val) => handleLineItemChange(idx, 'incomeAccount', val)}>
                            <SelectTrigger className="h-9 text-[12px] font-semibold bg-white">
                              <SelectValue placeholder="Select Account..." />
                            </SelectTrigger>
                            <SelectContent>
                              {INCOME_ACCOUNTS.map((acc) => (
                                <SelectItem key={acc.code} value={acc.name} className="text-xs font-semibold">
                                  {acc.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <code className="text-[11px] font-bold text-blue-600 bg-blue-50/50 px-2.5 py-1.5 rounded-md border border-slate-300 flex items-center justify-center min-w-[80px]">
                            {item.accountCode || "---"}
                          </code>
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          <div className="relative inline-block w-full max-w-[140px]">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₦</span>
                            <Input
                              type="number"
                              value={item.payingAmount || ""}
                              onChange={(e) => handleLineItemChange(idx, 'payingAmount', e.target.value)}
                              className="h-9 pl-6 text-right font-black text-sm bg-white focus-visible:ring-primary/20 tabular-nums"
                              placeholder="0.00"
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Transaction & Breakdown Section */}
          <div className="space-y-8">
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-600 flex items-center gap-2">
                Transaction Details
              </h4>
              <Card className="rounded-2xl bg-white border-input-50 px-6 py-5">
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger className="h-11 text-sm font-semibold bg-white">
                        <SelectValue placeholder="Select Payment Method..." />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_METHODS.map((method) => {
                          const Icon = method.icon;
                          return (
                            <SelectItem key={method.value} value={method.value} className="text-sm font-medium">
                              <div className="flex items-center gap-3">
                                <Icon className="h-4 w-4 text-slate-400" />
                                {method.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Payment Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-11 justify-start text-left font-semibold text-sm bg-white border hover:bg-slate-50 gap-3"
                        >
                          <CalendarIcon className="h-4 w-4 text-slate-500" />
                          {format(paymentDate, "MMM d, yyyy")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={paymentDate} onSelect={(date) => date && setPaymentDate(date)} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Discount Code</Label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        placeholder="e.g. REFER-20"
                        className="h-11 pl-10 text-sm font-semibold bg-white focus-visible:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-600">Payment Breakdown</h4>
              <Card className="rounded-2xl border-none bg-slate-900 text-white shadow-xl shadow-slate-200 overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-8 grid md:grid-cols-3 gap-8 items-center">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Total Outstanding</p>
                      <p className="text-2xl font-black tabular-nums">{formatCurrency(client.balance)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1f86f9]">Amount Recording</p>
                      <div className="flex items-center gap-2">
                        <Calculator className="h-5 w-5 text-[#1f86f9]" />
                        <p className="text-2xl font-black text-[#1f86f9] tabular-nums">{formatCurrency(totalPaying)}</p>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-6 text-center space-y-1 border border-white/10">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">Remaining Balance</p>
                      <p className={cn(
                        "text-3xl font-black tabular-nums tracking-tighter",
                        remainingBalance === 0 ? "text-emerald-400" : "text-white"
                      )}>
                        {formatCurrency(remainingBalance)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-3 text-slate-500">
              <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                <Receipt className="h-5 w-5 text-slate-400" />
              </div>
              <p className="text-sm font-medium">Recording allocation for {lineItems.filter(i => i.payingAmount > 0).length} procedural services</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => navigate("/payments")}>
                Cancel Entry
              </Button>
              <Button
                onClick={handleRecord}
                disabled={isSubmitting || totalPaying <= 0}
              >
                {isSubmitting ? "Processing..." : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    Finalize & Record Payment
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
