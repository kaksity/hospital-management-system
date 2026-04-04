import { useState, useEffect } from "react";
import { AmbulanceRequest, AmbulanceStatus, ambulanceRequests as initialData } from "@/data/ambulanceRequests";

const STORAGE_KEY = "ambulance_requests";

export function useAmbulanceRequests() {
  const [requests, setRequests] = useState<AmbulanceRequest[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialData;
    } catch {
      return initialData;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }, [requests]);

  const addRequest = (request: Omit<AmbulanceRequest, "id" | "requestedAt">) => {
    const newRequest: AmbulanceRequest = {
      ...request,
      id: `AMB-${String(requests.length + 1).padStart(3, "0")}`,
      requestedAt: new Date().toISOString(),
    };
    setRequests((prev) => [newRequest, ...prev]);
    return newRequest;
  };

  const updateStatus = (id: string, status: AmbulanceStatus) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const updates: Partial<AmbulanceRequest> = { status };
        if (status === "dispatched" && !r.dispatchedAt) {
          updates.dispatchedAt = new Date().toISOString();
        }
        if (status === "completed" && !r.completedAt) {
          updates.completedAt = new Date().toISOString();
        }
        return { ...r, ...updates };
      })
    );
  };

  const cancelRequest = (id: string) => updateStatus(id, "cancelled");

  return { requests, addRequest, updateStatus, cancelRequest };
}
