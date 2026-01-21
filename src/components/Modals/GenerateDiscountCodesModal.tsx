"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Ticket,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  History,
  Archive,
  Percent,
  Banknote
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DiscountCode {
  code: string;
  status: "used" | "unused";
  type: "percentage" | "fixed";
  value: string;
}

interface GenerateDiscountCodesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor: any;
}

export function GenerateDiscountCodesModal({
  open,
  onOpenChange,
  doctor,
}: GenerateDiscountCodesModalProps) {
  const [count, setCount] = React.useState("5");
  const [discountType, setDiscountType] = React.useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = React.useState("10");
  const [generating, setGenerating] = React.useState(false);
  const [allCodes, setAllCodes] = React.useState<DiscountCode[]>([]);
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  // Mock initial codes for the doctor when opening
  React.useEffect(() => {
    if (open && doctor) {
      const initialCodes: DiscountCode[] = [
        {
          code: `${doctor?.name?.split(" ")[1]?.substring(0, 3).toUpperCase()}-XJ92KH`,
          status: "used",
          type: "percentage",
          value: "10"
        },
        {
          code: `${doctor?.name?.split(" ")[1]?.substring(0, 3).toUpperCase()}-LM29PQ`,
          status: "unused",
          type: "fixed",
          value: "5000"
        },
      ];
      setAllCodes(initialCodes);
      setCount("5");
    }
  }, [open, doctor]);

  const handleGenerate = () => {
    setGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      const newCodes: DiscountCode[] = Array.from({ length: parseInt(count) || 1 }, () => {
        const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
        const prefix = doctor?.name?.split(" ")[1]?.substring(0, 3).toUpperCase() || "DOC";
        return {
          code: `${prefix}-${randomStr}`,
          status: "unused" as const,
          type: discountType,
          value: discountValue
        };
      });
      setAllCodes(prev => [...newCodes, ...prev]);
      setGenerating(false);
    }, 1200);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
        <div className="flex h-[580px]">
          {/* Left Column: Generator */}
          <div className="flex-[0.8] p-6 border-r border-border/50 bg-muted/5 flex flex-col overflow-y-auto">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Ticket className="h-5 w-5" />
              <DialogTitle>Generate Codes</DialogTitle>
            </div>
            <DialogDescription className="mb-6">
              Configure and create unique tracking codes for {doctor?.name}.
            </DialogDescription>

            <div className="space-y-5 flex-1">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                  Discount Type
                </Label>
                <Select
                  value={discountType}
                  onValueChange={(v: "percentage" | "fixed") => setDiscountType(v)}
                >
                  <SelectTrigger className="bg-background h-10">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">
                      <div className="flex items-center gap-2 font-medium">
                        <Percent className="h-3.5 w-3.5 text-blue-500" />
                        Percentage (%)
                      </div>
                    </SelectItem>
                    <SelectItem value="fixed">
                      <div className="flex items-center gap-2 font-medium">
                        <Banknote className="h-3.5 w-3.5 text-green-500" />
                        Fixed Amount (₦)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountValue" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                  {discountType === "percentage" ? "Percentage Value (%)" : "Fixed Amount (₦)"}
                </Label>
                <div className="relative">
                  <Input
                    id="discountValue"
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="bg-background h-10 pl-9"
                    placeholder={discountType === "percentage" ? "e.g. 10" : "e.g. 5000"}
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {discountType === "percentage" ? (
                      <Percent className="h-4 w-4" />
                    ) : (
                      <span className="text-sm font-bold">₦</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border/50">
                <Label htmlFor="codeCount" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                  Number of codes
                </Label>
                <Input
                  id="codeCount"
                  type="number"
                  min="1"
                  max="50"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  className="bg-background transition-colors h-10"
                />
              </div>

              <Button
                onClick={handleGenerate}
                className="w-full gap-2 py-6 text-sm font-semibold shadow-lg shadow-primary/10 transition-all active:scale-[0.98] mt-4"
                disabled={generating || !discountValue}
              >
                {generating ? (
                  <>
                    <RotateCcw className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Now
                  </>
                )}
              </Button>
            </div>

            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mt-6">
              <p className="text-[11px] text-blue-700 leading-normal">
                <strong>Config Tip:</strong> Percentage discounts are calculated on the total bill, while fixed amounts are deducted directly.
              </p>
            </div>
          </div>

          {/* Right Column: History */}
          <div className="flex-1 p-6 bg-background flex flex-col">
            <div className="flex items-center gap-2 text-muted-foreground mb-6">
              <History className="h-4 w-4" />
              <h4 className="text-sm font-semibold">
                Discount Ledger
              </h4>
              <Badge variant="secondary" className="text-[10px] font-bold px-2 h-5 rounded-full">
                {allCodes.length} Total
              </Badge>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {allCodes.length > 0 ? (
                <div className="space-y-3">
                  {allCodes.map((item, index) => (
                    <div
                      key={index}
                      className="group flex flex-col p-3 bg-muted/20 border border-input rounded-xl transition-all"
                    >
                      <div className="flex items-center justify-between mb-2 pb-2 border-b border-border/50">
                        <code className="text-sm font-bold tracking-tight text-foreground/90">{item.code}</code>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-primary transition-colors"
                            onClick={() => copyToClipboard(item.code, index)}
                          >
                            {copiedIndex === index ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-tight">Benefit</span>
                            <span className="font-semibold text-foreground flex items-center gap-1">
                              {item.type === "percentage" ? (
                                <><Percent className="h-2.5 w-2.5" />{item.value}% Off</>
                              ) : (
                                <>₦{parseInt(item.value).toLocaleString()} Off</>
                              )}
                            </span>
                          </div>
                          <div className="w-px h-6 bg-border/50" />
                          <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-tight">Status</span>
                            <Badge
                              className={cn(
                                "text-[9px] px-1.5 py-0 h-4 uppercase font-semibold text-white w-fit",
                                item.status === "used" ? "bg-gray-400" : "bg-green-500"
                              )}
                            >
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                        <span className="text-[10px] text-muted-foreground max-w-[100px] text-right leading-tight">
                          {item.status === "used" ? "Used on Patient Bill" : "Ready for usage"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50 grayscale scale-90">
                  <Archive className="h-10 w-10 mb-2" />
                  <p className="text-xs font-medium">No codes generated yet</p>
                </div>
              )}
            </div>

            <DialogFooter className="mt-6 sm:justify-center border-t border-border pt-4">
              <Button variant="ghost" className="w-full text-xs" onClick={() => onOpenChange(false)}>
                Close Codes Manager
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
