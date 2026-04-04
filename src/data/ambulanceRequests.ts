export type AmbulanceUrgency = "critical" | "high" | "medium" | "low";
export type AmbulanceStatus = "pending" | "dispatched" | "en-route" | "completed" | "cancelled";

export interface AmbulanceRequest {
  id: string;
  patientId: string;
  patientName: string;
  patientGender: "Male" | "Female";
  condition: string;
  urgency: AmbulanceUrgency;
  pickupLocation: string;
  notes: string;
  status: AmbulanceStatus;
  requestedBy: string;
  requestedAt: string;
  dispatchedAt?: string;
  completedAt?: string;
}

export const ambulanceRequests: AmbulanceRequest[] = [
  {
    id: "AMB-001",
    patientId: "CP120456A",
    patientName: "Alex Turner",
    patientGender: "Male",
    condition: "Severe chest pain, suspected cardiac event",
    urgency: "critical",
    pickupLocation: "12 Awolowo Road, Ikoyi, Lagos",
    notes: "Patient is conscious but reporting difficulty breathing. History of hypertension.",
    status: "completed",
    requestedBy: "Dr. Sarah Johnson",
    requestedAt: "2025-01-15T09:30:00.000Z",
    dispatchedAt: "2025-01-15T09:35:00.000Z",
    completedAt: "2025-01-15T10:10:00.000Z",
  },
  {
    id: "AMB-002",
    patientId: "CP120457B",
    patientName: "Grace Adeyemi",
    patientGender: "Female",
    condition: "Road traffic accident, multiple lacerations",
    urgency: "high",
    pickupLocation: "Marina Road Junction, Lagos Island",
    notes: "Patient alert but in significant pain. Suspected fracture of left leg.",
    status: "en-route",
    requestedBy: "Admin",
    requestedAt: "2025-01-20T14:15:00.000Z",
    dispatchedAt: "2025-01-20T14:20:00.000Z",
  },
  {
    id: "AMB-003",
    patientId: "CP120460E",
    patientName: "Emeka Okafor",
    patientGender: "Male",
    condition: "Diabetic emergency, loss of consciousness",
    urgency: "critical",
    pickupLocation: "45 Ozumba Mbadiwe Ave, Victoria Island",
    notes: "Patient unresponsive. Family reports history of Type 2 diabetes.",
    status: "dispatched",
    requestedBy: "Dr. Michael Chen",
    requestedAt: "2025-01-22T11:00:00.000Z",
    dispatchedAt: "2025-01-22T11:05:00.000Z",
  },
  {
    id: "AMB-004",
    patientId: "CP120461F",
    patientName: "Fatima Bello",
    patientGender: "Female",
    condition: "Obstetric emergency, active labour",
    urgency: "high",
    pickupLocation: "7 Broad Street, Lagos Island",
    notes: "Patient is 38 weeks pregnant. Labour has started unexpectedly at home.",
    status: "pending",
    requestedBy: "Customer Service",
    requestedAt: "2025-01-23T08:45:00.000Z",
  },
];
