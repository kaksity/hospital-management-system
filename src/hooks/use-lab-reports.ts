import { useState, useEffect } from "react";
import { LabReport, LabReportStatus, labReports as initialReports } from "@/data/labReports";

const STORAGE_KEY = "lab_reports";

export function useLabReports() {
  const [reports, setReports] = useState<LabReport[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialReports;
    } catch {
      return initialReports;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  }, [reports]);

  const addReport = (data: Omit<LabReport, "id">) => {
    const newReport: LabReport = {
      ...data,
      id: `LR-${String(reports.length + 1).padStart(3, "0")}`,
    };
    setReports(prev => [newReport, ...prev]);
    return newReport;
  };

  const updateStatus = (id: string, status: LabReportStatus) => {
    setReports(prev => prev.map(r =>
      r.id === id
        ? { ...r, status, ...(status === "completed" ? { completedAt: new Date().toISOString() } : {}) }
        : r
    ));
  };

  const updateReport = (id: string, updates: Partial<Omit<LabReport, "id">>) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  return { reports, addReport, updateStatus, updateReport };
}
