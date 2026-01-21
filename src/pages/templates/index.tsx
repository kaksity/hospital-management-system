"use client";

import { FileType, Plus, Search, Copy, Edit, Trash2, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ReportTemplates() {
    const templates = [
        { id: 1, name: "Normal Chest X-Ray", category: "X-RAY", lastUsed: "2 hours ago", status: "Published" },
        { id: 2, name: "Brain MRI (Pre-Contrast)", category: "MRI", lastUsed: "1 day ago", status: "Published" },
        { id: 3, name: "Abdominal CT Study", category: "CT SCAN", lastUsed: "3 days ago", status: "Draft" },
        { id: 4, name: "Pelvic Ultrasound Report", category: "ULTRASOUND", lastUsed: "5 hours ago", status: "Published" },
        { id: 5, name: "Cardiology Review Template", category: "CONSULT", lastUsed: "Yesterday", status: "Published" },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">Reporting Templates</h1>
                    <p className="text-muted-foreground text-sm">Create and manage standardized diagnostic report structures</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Template
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Tabs defaultValue="all" className="w-full sm:w-auto">
                    <TabsList variant="line" className="justify-start h-auto p-0 bg-transparent gap-6 border-b-0">
                        <TabsTrigger value="all" variant="line" className="px-0 pb-3 text-sm font-medium">All Modalities</TabsTrigger>
                        <TabsTrigger value="mri" variant="line" className="px-0 pb-3 text-sm font-medium">MRI</TabsTrigger>
                        <TabsTrigger value="ct" variant="line" className="px-0 pb-3 text-sm font-medium">CT Scan</TabsTrigger>
                        <TabsTrigger value="xray" variant="line" className="px-0 pb-3 text-sm font-medium">X-Ray</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="relative flex-1 max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search templates..." className="pl-9 h-10 border-muted-foreground/20" />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {templates.map((template) => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow border-muted-foreground/10 bg-card/50">
                        <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                                <div className="p-2.5 bg-primary/5 rounded-xl border border-primary/10">
                                    <FileType className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex gap-1">
                                    <Badge variant={template.status === "Published" ? "default" : "secondary"} className="h-5 text-[10px] font-bold tracking-tight">
                                        {template.status}
                                    </Badge>
                                </div>
                            </div>
                            <CardTitle className="mt-4 text-base font-semibold">{template.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-[10px] py-0 font-medium bg-muted/30">{template.category}</Badge>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0 pb-6">
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span>Used {template.lastUsed}</span>
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/5 hover:text-primary transition-colors">
                                        <Edit className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/5 hover:text-destructive transition-colors">
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
