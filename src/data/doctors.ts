export interface Doctor {
    id: string;
    name: string;
    hospital: string;
    phone: string;
    marketer: string;
    status: "active" | "inactive";
    createdAt: string;
    accountName?: string;
    bankName?: string;
    accountNumber?: string;
    usedCodes: number;
    totalCodes: number;
}

export const doctors: Doctor[] = [
    {
        id: "DOC-204",
        name: "Dr. Adeola Williams",
        hospital: "St. Nicholas Hospital",
        phone: "+234 801 222 3333",
        marketer: "Sarah Johnson",
        status: "active",
        createdAt: "2024-11-15",
        accountName: "Adeola Williams",
        bankName: "Zenith Bank",
        accountNumber: "1234567890",
        usedCodes: 25,
        totalCodes: 40
    },
    {
        id: "DOC-311",
        name: "Dr. Chidi Obi",
        hospital: "Reddington Hospital",
        phone: "+234 802 333 4444",
        marketer: "Michael Chen",
        status: "active",
        createdAt: "2024-12-01",
        accountName: "Chidi Obi",
        bankName: "Guaranty Trust Bank (GTB)",
        accountNumber: "0987654321",
        usedCodes: 12,
        totalCodes: 20
    },
    {
        id: "DOC-105",
        name: "Dr. Fatima Musa",
        hospital: "Main Radiology Wing",
        phone: "+234 803 444 5555",
        marketer: "Sarah Johnson",
        status: "inactive",
        createdAt: "2025-01-05",
        accountName: "Fatima Musa",
        bankName: "Access Bank",
        accountNumber: "1122334455",
        usedCodes: 5,
        totalCodes: 5
    }
];
