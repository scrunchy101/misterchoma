
import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ChefHat,
  ClipboardList,
  BookOpenCheck,
  Calendar,
  ShoppingCart,
  BarChart,
  CreditCard,
  Store
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-20 md:w-64 bg-gray-900 text-white flex flex-col min-h-screen">
      <div className="p-4 flex items-center justify-center md:justify-start">
        <h2 className="text-xl font-bold hidden md:block">Mister Choma</h2>
        <h2 className="text-xl font-bold md:hidden">MC</h2>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          <SidebarItem
            icon={<LayoutDashboard />}
            text="Dashboard"
            isActive={activeTab === "dashboard"}
            onClick={() => handleTabClick("dashboard")}
            to="/"
          />
          <SidebarItem
            icon={<Store />}
            text="POS"
            isActive={activeTab === "pos"}
            onClick={() => handleTabClick("pos")}
            to="/pos"
          />
          <SidebarItem
            icon={<ChefHat />}
            text="Menu"
            isActive={activeTab === "menu"}
            onClick={() => handleTabClick("menu")}
            to="/menu"
          />
          <SidebarItem
            icon={<ShoppingCart />}
            text="Orders"
            isActive={activeTab === "orders"}
            onClick={() => handleTabClick("orders")}
            to="/orders"
          />
          <SidebarItem
            icon={<ClipboardList />}
            text="Inventory"
            isActive={activeTab === "inventory"}
            onClick={() => handleTabClick("inventory")}
            to="/inventory"
          />
          <SidebarItem
            icon={<Calendar />}
            text="Reservations"
            isActive={activeTab === "reservations"}
            onClick={() => handleTabClick("reservations")}
            to="/reservations"
          />
          <SidebarItem
            icon={<CreditCard />}
            text="Billing"
            isActive={activeTab === "billing"}
            onClick={() => handleTabClick("billing")}
            to="/billing"
          />
          <SidebarItem
            icon={<Users />}
            text="Customers"
            isActive={activeTab === "customers"}
            onClick={() => handleTabClick("customers")}
            to="/customers"
          />
          <SidebarItem
            icon={<Users />}
            text="Employees"
            isActive={activeTab === "employees"}
            onClick={() => handleTabClick("employees")}
            to="/employees"
          />
          <SidebarItem
            icon={<BarChart />}
            text="Reports"
            isActive={activeTab === "reports"}
            onClick={() => handleTabClick("reports")}
            to="/reports"
          />
        </ul>
      </nav>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
  onClick: () => void;
  to: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  text,
  isActive,
  onClick,
  to,
}) => {
  return (
    <li>
      <Link
        to={to}
        className={`flex items-center px-4 py-3 ${
          isActive
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        } transition-colors rounded-md mx-2`}
        onClick={onClick}
      >
        <span className="mr-3">{icon}</span>
        <span className="hidden md:block">{text}</span>
      </Link>
    </li>
  );
};
