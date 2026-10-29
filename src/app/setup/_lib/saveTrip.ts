import { supabase } from "@/lib/supabase";
import { getEndDate, toISODate, type TripFormValue } from "./tripForm";

// TODO(작업자 B 4단계): 작업자 A의 데이터 계층 PR이 머지되면 createTrip 한 번 호출로 바꾼다.
// 그 전까지는 1.x setup/date·budget 화면이 하던 Supabase 저장을 한 번에 한다(로그인 사용자만).
export async function saveTrip(form: TripFormValue): Promise<{ ok: true } | { ok: false; message: string }> {
  const end = getEndDate(form);
  if (!form.departure || !end || !form.currency || form.amount === null) {
    return { ok: false, message: "입력값을 다시 확인해주세요." };
  }

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    return { ok: false, message: "로그인 정보를 확인할 수 없어요. 다시 로그인해주세요." };
  }

  const destination = form.destination.trim();
  const { error } = await supabase.from("trips").insert({
    user_id: authData.user.id,
    title: `${destination} 여행`,
    destination: null,
    start_date: toISODate(form.departure),
    end_date: toISODate(end),
    total_budget: form.amount,
    currency: form.currency,
    is_archived: false,
  });

  if (error) {
    console.error("여행 생성 실패:", error);
    return { ok: false, message: "여행을 저장하지 못했어요. 잠시 후 다시 시도해주세요." };
  }
  return { ok: true };
}
