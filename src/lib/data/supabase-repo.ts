import { supabase } from "@/lib/supabase";
import { RepositoryError, type TripRepository } from "./repository";
import type { Expense, Trip } from "./types";

function fail(message: string, cause: unknown): never {
  throw new RepositoryError(message, { cause });
}

/** 로그인 사용자의 Supabase 저장소. 권한은 RLS가 user_id로 한 번 더 확인한다 */
export function createSupabaseRepository(userId: string): TripRepository {
  return {
    async listTrips() {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("user_id", userId)
        .order("start_date", { ascending: false });
      if (error) fail("여행 목록을 불러오지 못했습니다.", error);
      return data as Trip[];
    },

    async getTrip(id) {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) fail("여행 정보를 불러오지 못했습니다.", error);
      return data as Trip | null;
    },

    async createTrip(input) {
      const { data, error } = await supabase
        .from("trips")
        .insert({ ...input, user_id: userId, is_archived: false })
        .select()
        .single();
      if (error) fail("여행을 만들지 못했습니다.", error);
      return data as Trip;
    },

    async updateTrip(id, patch) {
      const { data, error } = await supabase
        .from("trips")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (error) fail("여행 정보를 저장하지 못했습니다.", error);
      return data as Trip;
    },

    async deleteTrip(id) {
      // 기존 /travels 삭제와 같은 동작. expenses FK의 cascade 여부는 스키마 확인이 필요하다
      const { error } = await supabase.from("trips").delete().eq("id", id);
      if (error) fail("여행을 삭제하지 못했습니다.", error);
    },

    async listExpenses(tripId) {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("trip_id", tripId)
        .order("created_at", { ascending: false });
      if (error) fail("지출 내역을 불러오지 못했습니다.", error);
      return data as Expense[];
    },

    async listExpensesByTrips(tripIds) {
      if (tripIds.length === 0) return [];
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .in("trip_id", tripIds)
        .order("created_at", { ascending: false });
      if (error) fail("지출 내역을 불러오지 못했습니다.", error);
      return data as Expense[];
    },

    async createExpense(input) {
      const { data, error } = await supabase.from("expenses").insert(input).select().single();
      if (error) fail("지출을 저장하지 못했습니다.", error);
      return data as Expense;
    },

    async updateExpense(id, patch) {
      const { data, error } = await supabase
        .from("expenses")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (error) fail("지출을 저장하지 못했습니다.", error);
      return data as Expense;
    },

    async deleteExpense(id) {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) fail("지출을 삭제하지 못했습니다.", error);
    },
  };
}
