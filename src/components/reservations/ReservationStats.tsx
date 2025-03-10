
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const ReservationStats: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["reservationStats"],
    queryFn: async () => {
      const response = await supabase
        .from("reservations")
        .select("*");
      return response.data || [];
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">Total Reservations</h3>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data?.length || 0}</div>
        </CardContent>
      </Card>
    </div>
  );
};
