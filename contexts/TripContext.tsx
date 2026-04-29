"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

type Trip = {
  id: string;
  user_id: string;
  title: string;
  destination: string | null;
  start_date: string;
  end_date: string;
  total_budget: number;
  currency: string;
  is_archived: boolean;
};

type TripState = {
  trip: Trip | null;
  loading: boolean;
  /** 캐시를 무효화하고 다시 fetch */
  refresh: () => void;
};

const TripContext = createContext<TripState>({
  trip: null,
  loading: true,
  refresh: () => {},
});

export function TripProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTrip = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("trips")
      .select("*")
      .eq("user_id", userId)
      .eq("is_archived", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    setTrip(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setTrip(null);
      setLoading(false);
      return;
    }

    fetchTrip(user.id);
  }, [authLoading, user, fetchTrip]);

  const refresh = useCallback(() => {
    if (user) {
      setLoading(true);
      fetchTrip(user.id);
    }
  }, [user, fetchTrip]);

  return (
    <TripContext.Provider value={{ trip, loading, refresh }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  return useContext(TripContext);
}
