import { supabase } from "@/lib/supabase";
import { RepositoryError } from "./repository";
import { clearGuestData, importGuestData, readGuestData } from "./local-repo";
import { createSupabaseRepository } from "./supabase-repo";

// 게스트 데이터와 계정 사이의 이전 (docs/flow-v2.md §5 「게스트」「1.x 게스트 데이터 전환」).

/**
 * 로그인하면 기기의 게스트 여행·지출을 계정으로 옮긴다.
 * 같은 id로 upsert하고 이미 있는 행은 건너뛰므로, 중간에 실패해 다시 시도해도 중복되지 않는다.
 * 둘 다 성공했을 때만 기기 사본을 지운다. 실패하면 기기 사본을 남기고 throw한다.
 *
 * @returns 옮긴 여행이 있으면 true
 */
export async function uploadGuestData(userId: string): Promise<boolean> {
  const { trips, expenses } = readGuestData();
  if (trips.length === 0 && expenses.length === 0) return false;

  if (trips.length > 0) {
    const { error } = await supabase
      .from("trips")
      .upsert(
        trips.map((t) => ({ ...t, user_id: userId })),
        { onConflict: "id", ignoreDuplicates: true },
      );
    if (error) throw new RepositoryError("기기의 여행을 계정으로 옮기지 못했습니다.", { cause: error });
  }

  if (expenses.length > 0) {
    const { error } = await supabase
      .from("expenses")
      .upsert(expenses, { onConflict: "id", ignoreDuplicates: true });
    if (error) throw new RepositoryError("기기의 지출을 계정으로 옮기지 못했습니다.", { cause: error });
  }

  clearGuestData();
  return trips.length > 0;
}

/**
 * 1.x 익명 계정의 여행·지출을 기기로 내려받는다. 서버 데이터는 지우지 않는다.
 * 성공하면 호출부가 익명 세션을 로그아웃한다.
 * TODO(A 3b): 익명 로그인을 없앨 때 01 앱 시작에서 연결한다.
 */
export async function downloadAnonymousData(userId: string): Promise<void> {
  const repo = createSupabaseRepository(userId);
  const trips = await repo.listTrips();
  const expenses = await repo.listExpensesByTrips(trips.map((t) => t.id));
  importGuestData(trips, expenses);
}
