
import React from "react";
import { 
  Calendar, 
  CreditCard, 
  FileText, 
  Home, 
  MessageSquare, 
  Users, 
  Package, 
  ShoppingCart, 
  UserCog,
  Store
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  activeTab: string;
  onClick: (value: string) => void;
  to: string;
}

const NavItem = ({ icon: Icon, label, value, activeTab, onClick, to }: NavItemProps) => (
  <Link 
    to={to}
    className={cn(
      "flex items-center px-4 py-3 cursor-pointer",
      activeTab === value 
        ? "bg-gray-800 text-white border-l-4 border-gray-400" 
        : "text-gray-300 hover:bg-gray-700"
    )}
    onClick={() => onClick(value)}
  >
    <Icon size={18} className="mr-3" />
    <span>{label}</span>
  </Link>
);

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const navItems = [
    { icon: Home, label: "Dashboard", value: "dashboard", to: "/" },
    { icon: Store, label: "POS", value: "pos", to: "/pos" },
    { icon: Calendar, label: "Reservations", value: "reservations", to: "/reservations" },
    { icon: Users, label: "Customers", value: "customers", to: "/customers" },
    { icon: UserCog, label: "Employees", value: "employees", to: "/employees" },
    { icon: ShoppingCart, label: "Orders", value: "orders", to: "/orders" },
    { icon: Package, label: "Inventory", value: "inventory", to: "/inventory" },
    { icon: MessageSquare, label: "Feedback", value: "feedback", to: "#" },
    { icon: CreditCard, label: "Billing", value: "billing", to: "/billing" },
    { icon: FileText, label: "Reports", value: "reports", to: "#" },
  ];

  return (
    <div className="w-64 bg-gray-900 shadow-md">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">Mister Choma Restaurant</h1>
        <p className="text-sm text-gray-400">Restaurant Management</p>
      </div>
      
      <nav className="mt-6">
        {navItems.map((item) => (
          <NavItem
            key={item.value}
            icon={item.icon}
            label={item.label}
            value={item.value}
            activeTab={activeTab}
            onClick={setActiveTab}
            to={item.to}
          />
        ))}
      </nav>
    </div>
  );
};
