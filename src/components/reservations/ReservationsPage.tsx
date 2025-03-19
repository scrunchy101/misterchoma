
import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ReservationsList } from "@/components/reservations/ReservationsList";
import { ReservationCalendar } from "@/components/reservations/ReservationCalendar";
import { ReservationStats } from "@/components/reservations/ReservationStats";

export const ReservationsPage = () => {
  const [activeTab, setActiveTab] = useState('reservations');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <Header title="Reservations" />
        
        {/* Reservations Content */}
        <main className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Reservations Management</h2>
              <p className="text-gray-500">Manage your restaurant's bookings and tables</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setViewMode('list')} 
                className={`px-4 py-2 rounded-md ${viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300'}`}
              >
                List View
              </button>
              <button 
                onClick={() => setViewMode('calendar')} 
                className={`px-4 py-2 rounded-md ${viewMode === 'calendar' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300'}`}
              >
                Calendar View
              </button>
            </div>
          </div>

          {/* Reservation Stats */}
          <ReservationStats selectedDate={selectedDate} />
          
          {/* Reservations Content Based on View Mode */}
          {viewMode === 'list' ? (
            <ReservationsList selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          ) : (
            <ReservationCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          )}
        </main>
      </div>
    </div>
  );
};
