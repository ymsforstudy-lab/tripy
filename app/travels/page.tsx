"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/layout/BottomNav";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { COUNTRIES } from "@/lib/constants/countries";
import LoadingScreen from "@/components/ui/LoadingScreen";

type Trip = {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
};

function extractEmojiFromTitle(title: string): string {
  const match = COUNTRIES.find((c) => title.includes(c.name));
  return match?.emoji ?? "🌍";
}

function calcDDay(startDate: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const diff = Math.floor(
    (start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff === 0) return "D-day";
  if (diff > 0) return `D - ${diff}`;
  return `D + ${Math.abs(diff)}`;
}

function formatDate(dateStr: string): string {
  return dateStr.replace(/-/g, ".");
}

const ManageIcon = ({ color = "#6BC20F" }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <g transform="translate(1.676, 3.332)">
      <path
        fillRule="nonzero"
        fill={color}
        d="M7.4917 11.6687 L16.6583 11.6687 L16.6583 13.3354 L7.4917 13.3354 L7.4917 11.6687 Z M9.4 0.2437 L7.9083 1.7354 L11.5833 5.4104 L13.075 3.9187 C13.2322 3.7616 13.3187 3.5493 13.3187 3.3312 C13.3187 3.1131 13.2322 2.9008 13.075 2.7437 L10.575 0.2437 C10.4179 0.0865 10.2056 0 9.9875 0 C9.7694 0 9.5572 0.0865 9.4 0.2437 Z M6.7333 2.9187 L0.2417 9.4104 C0.0846 9.5675 0 9.7798 0 10.002 L0 12.502 C0 12.9604 0.375 13.3354 0.8333 13.3354 L3.3333 13.3354 C3.5583 13.3354 3.7667 13.2437 3.925 13.0937 L10.4167 6.602 L6.7417 2.927 L6.7333 2.9187 Z"
      />
    </g>
  </svg>
);

export default function TravelsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"ongoing" | "ended">("ongoing");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/");
      return;
    }

    async function fetchTrips() {
      const { data, error } = await supabase
        .from("trips")
        .select("id, title, start_date, end_date")
        .eq("user_id", user!.id)
        .order("start_date", { ascending: false });

      if (!error && data) {
        setTrips(data);
      }
      setLoading(false);
    }
    fetchTrips();
  }, [authLoading, user, router]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const ongoingTrips = trips.filter((t) => new Date(t.end_date) >= today);
  const endedTrips = trips.filter((t) => new Date(t.end_date) < today);
  const displayTrips = activeTab === "ongoing" ? ongoingTrips : endedTrips;

  return (
    <div className="relative mx-auto flex min-h-screen max-w-[390px] flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-center pb-4 pt-6">
        <span className="text-base font-bold leading-[1.5] text-gray-90">
          여행 관리
        </span>
      </div>

      {/* Tab Bar */}
      <div className="flex h-12 items-center">
        <button
          className={`flex h-12 flex-1 items-center justify-center text-sm font-bold transition-colors ${
            activeTab === "ongoing"
              ? "border-b-2 border-green-50 text-gray-90"
              : "text-gray-50"
          }`}
          onClick={() => setActiveTab("ongoing")}
        >
          진행 중인 여행
        </button>
        <button
          className={`flex h-12 flex-1 items-center justify-center text-sm font-bold transition-colors ${
            activeTab === "ended"
              ? "border-b-2 border-green-50 text-gray-90"
              : "text-gray-50"
          }`}
          onClick={() => setActiveTab("ended")}
        >
          종료된 여행
        </button>
      </div>

      {/* Trip List */}
      <div className="flex flex-1 flex-col gap-4 px-4 pb-36 pt-4">
        {loading ? (
          <div className="flex flex-1 items-center justify-center py-20">
            <LoadingScreen />
          </div>
        ) : displayTrips.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-20">
            <span className="text-sm text-gray-50">여행이 없습니다.</span>
          </div>
        ) : (
          displayTrips.map((trip) => {
            const dday = calcDDay(trip.start_date);
            const isOngoing = activeTab === "ongoing";
            return (
              <div
                key={trip.id}
                className={`relative flex h-[100px] items-center gap-4 overflow-hidden rounded-2xl px-3 py-[14px] ${
                  isOngoing ? "bg-green-0" : "bg-gray-5"
                }`}
              >
                {/* Flag */}
                <div className="flex shrink-0 size-[52px] items-center justify-center rounded-xl bg-white">
                  <span className="text-[32px] leading-none">
                    {extractEmojiFromTitle(trip.title)}
                  </span>
                </div>

                {/* Trip info */}
                <div className="flex flex-col gap-[5px]">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-black">
                      {trip.title}
                    </span>
                    {isOngoing ? (
                      <span className="rounded-full bg-info-5 px-3 py-1 text-xs text-info-50">
                        {dday}
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-20 px-3 py-1 text-xs text-gray-60">
                        종료
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-90">
                    {formatDate(trip.start_date)} ~{" "}
                    {formatDate(trip.end_date)}
                  </span>
                </div>

                {/* Edit icon */}
                <Link
                  href={`/travels/${trip.id}/edit`}
                  className="absolute right-3 top-[14px]"
                >
                  <ManageIcon color={isOngoing ? "#6BC20F" : "#8E8E8E"} />
                </Link>
              </div>
            );
          })
        )}
      </div>

      {/* Floating action button */}
      <div className="fixed bottom-[116px] left-1/2 flex w-full max-w-[390px] -translate-x-1/2 items-center justify-end gap-2 px-4">
        {/* Tooltip bubble */}
        <div className="relative">
          <div className="rounded-lg bg-info-5 px-[10px] py-[5px]">
            <span className="whitespace-nowrap text-xs text-info-50">
              새로운 여행지를 등록해 보세요!
            </span>
          </div>
          {/* Triangle tail */}
          <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 border-y-[6px] border-l-[6px] border-y-transparent border-l-info-5" />
        </div>

        {/* FAB */}
        <Link
          href="/setup/country"
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-green-40 bg-green-50"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5V19M5 12H19"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}
