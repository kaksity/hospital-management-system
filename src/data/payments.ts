export const payments = [
    {
        id: "TXN-001",
        patientId: "PAT-105",
        patientName: "John Adebayo",
        patientType: "Regular",
        gender: "Male",
        accountCode: "MRI-01",
        method: "Bank Transfer",
        totalCost: 150000,
        amountPaid: 100000,
        balance: 50000,
        status: "partial",
        date: "2024-11-15",
        invoiceNo: "INV-2024-101",
        paymentPlan: [
            { name: "Initial Deposit", amount: 100000, date: "2024-11-15", status: "paid" },
            { name: "Final Balance", amount: 50000, date: "2024-11-30", status: "partial" }
        ],
        services: [
            { name: "MRI Brain (With Contrast)", price: 150000, category: "MRI" }
        ]
    },
    {
        id: "TXN-002",
        patientId: "PAT-211",
        patientName: "Sarah Phillips",
        patientType: "Regular",
        gender: "Female",
        accountCode: "CT-02",
        method: "Card",
        totalCost: 45000,
        amountPaid: 45000,
        balance: 0,
        status: "paid",
        date: "2024-12-01",
        invoiceNo: "INV-2024-102",
        paymentPlan: [
            { name: "Full Payment", amount: 45000, date: "2024-12-01", status: "paid" }
        ],
        services: [
            { name: "CT Scan Head", price: 45000, category: "CT" }
        ]
    },
    {
        id: "TXN-003",
        patientId: "PAT-094",
        patientName: "Michael Chen",
        patientType: "Regular",
        gender: "Male",
        accountCode: "XRY-01",
        method: "Cash",
        totalCost: 85000,
        amountPaid: 5000,
        balance: 80000,
        status: "partial",
        date: "2025-01-05",
        invoiceNo: "INV-2025-001",
        paymentPlan: [
            { name: "Initial Fee", amount: 5000, date: "2025-01-05", status: "paid" },
            { name: "Outstanding", amount: 80000, date: "2025-01-15", status: "partial" }
        ],
        services: [
            { name: "Emergency Radiology Consult", price: 35000, category: "Consultation" },
            { name: "Chest X-Ray", price: 50000, category: "X-Ray" }
        ]
    },
    {
        id: "TXN-004",
        patientId: "PAT-302",
        patientName: "Elena Rodriguez",
        patientType: "Regular",
        gender: "Female",
        accountCode: "MRI-02",
        method: "Bank Transfer",
        totalCost: 250000,
        amountPaid: 250000,
        balance: 0,
        status: "paid",
        date: "2025-01-10",
        invoiceNo: "INV-2025-002",
        paymentPlan: [
            { name: "Down Payment", amount: 250000, date: "2025-01-10", status: "paid" }
        ],
        services: [
            { name: "MRI Spine (Lumbar)", price: 250000, category: "MRI" }
        ]
    },
    {
        id: "TXN-005",
        patientId: "PAT-118",
        patientName: "David Wilson",
        patientType: "Regular",
        gender: "Male",
        accountCode: "ULS-01",
        method: "Card",
        totalCost: 12000,
        amountPaid: 4000,
        balance: 8000,
        status: "partial",
        date: "2025-01-12",
        invoiceNo: "INV-2025-003",
        paymentPlan: [
            { name: "Part Payment", amount: 4000, date: "2025-01-12", status: "paid" },
            { name: "Outstanding", amount: 8000, date: "2025-01-20", status: "partial" }
        ],
        services: [
            { name: "Abdominal Ultrasound", price: 12000, category: "Ultrasound" }
        ]
    }
];
