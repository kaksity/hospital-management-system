import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

/* ---------------- TabsList ---------------- */
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    variant?: "default" | "line";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const base =
    variant === "line"
      ? "flex border-b border-border text-muted-foreground w-full"
      : "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground";
  return (
    <TabsPrimitive.List ref={ref} className={cn(base, className)} {...props} />
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

/* ---------------- TabsTrigger ---------------- */
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    variant?: "default" | "line";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const base =
    variant === "line"
      ? // 🧩 line style
        "relative inline-flex items-center justify-center whitespace-nowrap border-b-2 border-transparent px-3 py-2 text-sm font-medium transition-all hover:text-foreground data-[state=active]:border-[#fe5e41] data-[state=active]:text-foreground"
      : // 🧩 default style
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(base, className)}
      {...props}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

/* ---------------- TabsContent ---------------- */
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
