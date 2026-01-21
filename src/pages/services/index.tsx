"use client";

import { useState } from "react";
import {
    Plus,
    Search,
    LayoutGrid,
    Scan,
    Settings2,
    MoreHorizontal,
    Trash2,
    Edit,
    Activity,
    Zap,
    Microscope,
    Stethoscope
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatCurrency";

const services = [
    { id: 1, name: "MRI Brain (Contrast)", category: "MRI", price: 150000, duration: "45 mins", icon: Activity, active: true },
    { id: 2, name: "CT Head", category: "CT SCAN", price: 45000, duration: "15 mins", icon: Zap, active: true },
    { id: 3, name: "Chest X-Ray", category: "X-RAY", price: 12000, duration: "10 mins", icon: Scan, active: true },
    { id: 4, name: "Abdominal Ultrasound", category: "ULTRASOUND", price: 25000, duration: "30 mins", icon: Microscope, active: true },
    { id: 5, name: "Cardiology Consult", category: "CONSULTATION", price: 35000, duration: "20 mins", icon: Stethoscope, active: false },
];

export default function Services() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredServices = services.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">Radiology Services</h1>
                    <p className="text-muted-foreground text-sm">Configure and manage your inventory of scans and medical services</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Add New Service</span>
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search services, modalities..."
                        className="pl-9 h-11 border-muted-foreground/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-11 w-11">
                        <Settings2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Card className="border-none shadow-none bg-transparent">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-border/50">
                            <TableHead className="w-[300px]">Service Name</TableHead>
                            <TableHead>Modality / Category</TableHead>
                            <TableHead>Base Price</TableHead>
                            <TableHead>Est. Duration</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredServices.map((service) => (
                            <TableRow key={service.id} className="hover:bg-muted/50 transition-colors border-b border-border/50">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/5 rounded-lg">
                                            <service.icon className="h-4 w-4 text-primary" />
                                        </div>
                                        <span className="font-semibold text-sm">{service.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="text-[10px] font-bold tracking-wider">
                                        {service.category}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-semibold text-sm">
                                    {formatCurrency(service.price)}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground font-medium">
                                    {service.duration}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5">
                                        <div className={`h-2 w-2 rounded-full ${service.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                                        <span className="text-xs font-medium">{service.active ? 'Active' : 'Inactive'}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[160px]">
                                            <DropdownMenuItem>
                                                <Edit className="h-4 w-4 mr-2" /> Edit Service
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <LayoutGrid className="h-4 w-4 mr-2" /> Linked Techs
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">
                                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
