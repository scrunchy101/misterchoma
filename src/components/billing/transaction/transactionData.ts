
export interface Transaction {
  id: string;
  date: Date;
  customer: string;
  amount: number;
  items: number;
  paymentMethod: string;
  status: string;
}

export interface TransactionItem {
  name: string;
  quantity: number;
  price: number;
}

// Sample transaction data
export const sampleTransactions: Transaction[] = [
  {
    id: "TX-2023-08-001",
    date: new Date(2023, 7, 25, 19, 30),
    customer: "James Wilson",
    amount: 142500,
    items: 6,
    paymentMethod: "Credit Card",
    status: "completed"
  },
  {
    id: "TX-2023-08-002",
    date: new Date(2023, 7, 25, 20, 15),
    customer: "Sarah Johnson",
    amount: 86750,
    items: 3,
    paymentMethod: "Credit Card",
    status: "completed"
  },
  {
    id: "TX-2023-08-003",
    date: new Date(2023, 7, 25, 21, 0),
    customer: "Michael Chen",
    amount: 235000,
    items: 8,
    paymentMethod: "Credit Card",
    status: "completed"
  },
  {
    id: "TX-2023-08-004",
    date: new Date(2023, 7, 26, 18, 45),
    customer: "Lisa Rodriguez",
    amount: 92250,
    items: 4,
    paymentMethod: "Credit Card",
    status: "completed"
  },
  {
    id: "TX-2023-08-005",
    date: new Date(2023, 7, 26, 19, 30),
    customer: "Robert Kim",
    amount: 176800,
    items: 7,
    paymentMethod: "Credit Card",
    status: "completed"
  }
];

// Sample items for each transaction
export const sampleTransactionItems: Record<string, TransactionItem[]> = {
  "TX-2023-08-001": [
    { name: "Beef Burger", quantity: 2, price: 25000 },
    { name: "Fries", quantity: 2, price: 15000 },
    { name: "Soda", quantity: 2, price: 6250 },
  ],
  "TX-2023-08-002": [
    { name: "Chicken Pizza", quantity: 1, price: 45000 },
    { name: "Garlic Bread", quantity: 1, price: 12000 },
    { name: "Beer", quantity: 2, price: 14875 },
  ],
  "TX-2023-08-003": [
    { name: "Seafood Platter", quantity: 1, price: 120000 },
    { name: "Grilled Fish", quantity: 1, price: 65000 },
    { name: "White Wine", quantity: 1, price: 50000 },
  ],
  "TX-2023-08-004": [
    { name: "Vegetable Pasta", quantity: 2, price: 36000 },
    { name: "Caesar Salad", quantity: 1, price: 20250 },
  ],
  "TX-2023-08-005": [
    { name: "T-Bone Steak", quantity: 2, price: 75000 },
    { name: "Mashed Potatoes", quantity: 2, price: 12000 },
    { name: "Red Wine", quantity: 1, price: 45000 },
  ]
};
