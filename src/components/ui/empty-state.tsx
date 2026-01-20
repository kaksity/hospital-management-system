import * as React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
        icon?: LucideIcon;
    };
    className?: string;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center text-center p-8 py-12 bg-muted/20 border border-dashed rounded-xl",
                className
            )}
        >
            {Icon && (
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-muted-foreground" />
                </div>
            )}
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            {description && (
                <p className="text-sm text-muted-foreground max-w-[280px] mt-2 mb-6">
                    {description}
                </p>
            )}
            {action && (
                <Button onClick={action.onClick} className="gap-2">
                    {action.icon && <action.icon className="h-4 w-4" />}
                    {action.label}
                </Button>
            )}
        </div>
    );
}
