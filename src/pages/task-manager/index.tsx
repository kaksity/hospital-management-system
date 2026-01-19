"use client";

import { useState } from "react";
import { CasesTable } from "@/components/Tables/CasesTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ChooseVisaCategoryModal from "@/components/Modals/ChooseVisaCategoryModal";

export default function Cases() {
  const [showModal, setShowModal] = useState(false);

  const cases = [
    {
      id: "ACV-2024-001",
      visaType: "O-1A Visa",
      clientName: "Alex Turner",
      clientAvatar: "",
      status: "Active",
      priority: "High",
      progress: 85,
      nextDeadline: "2025-11-15",
      assignedTo: "Sarah Johnson",
      assigneeAvatar: "",
    },
    {
      id: "ACV-2024-002",
      visaType: "EB-1A Visa",
      clientName: "Maria Garcia",
      clientAvatar: "",
      status: "Review",
      priority: "Medium",
      progress: 55,
      nextDeadline: "2025-11-20",
      assignedTo: "Michael Chen",
      assigneeAvatar: "",
    },
    {
      id: "ACV-2024-003",
      visaType: "O-1B Visa",
      clientName: "James Wilson",
      clientAvatar: "",
      status: "Draft",
      priority: "Low",
      progress: 25,
      nextDeadline: "2025-11-10",
      assignedTo: "Sarah Johnson",
      assigneeAvatar: "",
    },
    {
      id: "ACV-2023-045",
      visaType: "EB-2 NIW",
      clientName: "Lisa Wang",
      clientAvatar: "",
      status: "Approved",
      priority: "Completed",
      progress: 100,
      nextDeadline: "2025-10-01",
      assignedTo: "David Rodriguez",
      assigneeAvatar: "",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Cases</h1>
          <p className="text-muted-foreground">
            Manage all your immigration cases
          </p>
        </div>
        <Button className="gap-2" onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4" />
          <span>New Case</span>
        </Button>
      </div>

      {/* Cases Table */}
      <CasesTable data={cases} />

      {/* Choose Visa Category Modal */}
      <ChooseVisaCategoryModal open={showModal} onOpenChange={setShowModal} />
    </div>
  );
}
