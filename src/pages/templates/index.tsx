"use client";

import { FileType, Plus, Search, Copy, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportTemplates() {
    const templates = [
        { id: 1, name: "Normal Chest X-Ray", category: "Radiology", lastUsed: "2024-01-15" },
        { id: 2, name: "Brain MRI Contrast", category: "Neurology", lastUsed: "2024-01-18" },
        { id: 3, name: "Abdominal Ultrasound", category: "General", lastUsed: "2024-01-10" },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Report Templates</h1>
                    <p className="text-muted-foreground">Manage predefined templates for diagnostic reporting.</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Template
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search templates..." className="pl-9" />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {templates.map((template) => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <FileType className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <CardTitle className="mt-4 text-lg">{template.name}</CardTitle>
                            <CardDescription>{template.category}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground">Last used: {template.lastUsed}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
