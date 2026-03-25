"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/layout/BottomNav";
import { supabase } from "@/lib/supabase";
import { COUNTRIES } from "@/lib/constants/countries";

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

const PencilIcon = ({ color = "#6BC20F" }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M14.1667 2.5L17.5 5.83333L6.66667 16.6667H3.33333V13.3333L14.1667 2.5Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function TravelsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"ongoing" | "ended">("ongoing");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrips() {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("[travels] session:", session);

      if (!session) {
        router.push("/");
        return;
      }

      const { data, error } = await supabase
        .from("trips")
        .select("id, title, start_date, end_date")
        .eq("user_id", session.user.id)
        .order("start_date", { ascending: false });

      console.log("[travels] data:", data, "error:", error);

      if (!error && data) {
        setTrips(data);
      }
      setLoading(false);
    }
    fetchTrips();
  }, []);

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
            <span className="text-sm text-gray-50">로딩 중...</span>
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
                <span className="shrink-0 text-[40px] leading-[1.5] tracking-[0.4px]">
                  {extractEmojiFromTitle(trip.title)}
                </span>

                {/* Trip info */}
                <div className="flex flex-col gap-[5px]">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-black">
                      {trip.title}
                    </span>
                    {isOngoing && (
                      <span className="rounded-full bg-info-5 px-3 py-1 text-xs font-bold text-info-50">
                        {dday}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-90">
                    {formatDate(trip.start_date)} ~{" "}
                    {formatDate(trip.end_date)}
                  </span>
                </div>

                {/* Edit icon */}
                <button className="absolute right-3 top-[14px]">
                  <PencilIcon color={isOngoing ? "#6BC20F" : "#8E8E8E"} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Floating action button */}
      <div className="fixed bottom-[88px] left-1/2 flex w-full max-w-[390px] -translate-x-1/2 items-center justify-end gap-2 px-4">
        {/* Tooltip bubble */}
        <div className="relative flex items-center">
          <div className="rounded-lg bg-info-5 px-[10px] py-[5px]">
            <span className="whitespace-nowrap text-xs text-info-50">
              새로운 여행지를 등록해 보세요!
            </span>
          </div>
          {/* Pointer dot */}
          <div className="size-2 rounded-full bg-info-5" />
        </div>

        {/* FAB */}
        <button className="flex size-11 shrink-0 items-center justify-center rounded-full border border-green-40 bg-green-50">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5V19M5 12H19"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
