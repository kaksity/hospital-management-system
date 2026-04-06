import { useState, useEffect } from "react";
import { LabTestDefinition, initialLabCatalog } from "@/data/labReports";

const STORAGE_KEY = "lab_test_catalog";

export function useLabCatalog() {
  const [catalog, setCatalog] = useState<LabTestDefinition[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialLabCatalog;
    } catch {
      return initialLabCatalog;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
  }, [catalog]);

  const addTest = (test: Omit<LabTestDefinition, "id">) => {
    const newTest: LabTestDefinition = {
      ...test,
      id: `TC-${String(catalog.length + 1).padStart(3, "0")}`,
    };
    setCatalog(prev => [...prev, newTest]);
    return newTest;
  };

  const updateTest = (id: string, updates: Partial<Omit<LabTestDefinition, "id">>) => {
    setCatalog(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTest = (id: string) => {
    setCatalog(prev => prev.filter(t => t.id !== id));
  };

  return { catalog, addTest, updateTest, deleteTest };
}
