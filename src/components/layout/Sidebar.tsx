
import React from "react";
import { Calendar, CreditCard, FileText, Home, MessageSquare, Users } from "lucide-react";
import { cn } from "@/lib/utils";

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
}

const NavItem = ({ icon: Icon, label, value, activeTab, onClick }: NavItemProps) => (
  <div 
    className={cn(
      "flex items-center px-4 py-3 cursor-pointer",
      activeTab === value 
        ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600" 
        : "text-gray-600 hover:bg-gray-50"
    )}
    onClick={() => onClick(value)}
  >
    <Icon size={18} className="mr-3" />
    <span>{label}</span>
  </div>
);

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const navItems = [
    { icon: Home, label: "Dashboard", value: "dashboard" },
    { icon: Calendar, label: "Reservations", value: "reservations" },
    { icon: Users, label: "Customers", value: "customers" },
    { icon: MessageSquare, label: "Feedback", value: "feedback" },
    { icon: CreditCard, label: "Billing", value: "billing" },
    { icon: FileText, label: "Reports", value: "reports" },
  ];

  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">TableMaster CRM</h1>
        <p className="text-sm text-gray-500">Restaurant Management</p>
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
          />
        ))}
      </nav>
    </div>
  );
};
