export interface Hospital {
    id: string;
    accountCode: string;
    name: string;
    location: string;
    status: "active" | "inactive";
    createdAt: string;
}

export const hospitals: Hospital[] = [
    {
        id: "HOS-001",
        accountCode: "ACC-9921",
        name: "Main Radiology Wing",
        location: "6 Babtunde Street, Lagos, Nigeria",
        status: "active",
        createdAt: "2024-05-15",
    },
    {
        id: "HOS-002",
        accountCode: "ACC-8842",
        name: "St. Nicholas Hospital",
        location: "57 Campbell Street, Lagos Island, Lagos",
        status: "active",
        createdAt: "2024-06-20",
    },
    {
        id: "HOS-003",
        accountCode: "ACC-7753",
        name: "Reddington Hospital",
        location: "39 Isaac John Street, Ikeja, Lagos",
        status: "inactive",
        createdAt: "2024-07-10",
    },
    {
        id: "HOS-004",
        accountCode: "ACC-6634",
        name: "Lagos University Teaching Hospital",
        location: "Idi-Araba, Lagos",
        status: "active",
        createdAt: "2024-08-05",
    },
    {
        id: "HOS-005",
        accountCode: "ACC-1122",
        name: "Evercare Hospital",
        location: "Lekki Phase 1, Lagos",
        status: "active",
        createdAt: "2024-09-12",
    },
    {
        id: "HOS-006",
        accountCode: "ACC-3344",
        name: "Paelon Memorial Clinic",
        location: "Victoria Island, Lagos",
        status: "active",
        createdAt: "2024-10-01",
    },
];
