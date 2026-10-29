import { RepositoryError, type TripRepository } from "./repository";
import type { Expense, Trip } from "./types";

// 게스트(비로그인) 저장소. 이 기기의 localStorage에만 저장한다 (docs/flow-v2.md §5 「게스트」).
// id는 UUID로 만들어 로그인 후 Supabase로 옮길 때 같은 id를 그대로 쓴다.

const STORAGE_KEY = "tripy:guest:v1";

type GuestData = {
  trips: Trip[];
  expenses: Expense[];
};

const EMPTY: GuestData = { trips: [], expenses: [] };

export function readGuestData(): GuestData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<GuestData>;
    return { trips: parsed.trips ?? [], expenses: parsed.expenses ?? [] };
  } catch {
    // 시크릿 모드·차단된 저장소·깨진 JSON은 빈 데이터로 본다
    return EMPTY;
  }
}

function writeGuestData(data: GuestData) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (cause) {
    throw new RepositoryError("이 기기에 저장하지 못했습니다.", { cause });
  }
}

/** 기기에 게스트 여행이 있는지. 진입 분기에서 쓴다 */
export function hasGuestData(): boolean {
  return readGuestData().trips.length > 0;
}

/** 여행·지출을 기기에 합쳐 넣는다. 같은 id가 이미 있으면 건너뛴다 (1.x 익명 데이터 내려받기용) */
export function importGuestData(trips: Trip[], expenses: Expense[]) {
  const data = readGuestData();
  const tripIds = new Set(data.trips.map((t) => t.id));
  const expenseIds = new Set(data.expenses.map((e) => e.id));
  writeGuestData({
    trips: [...data.trips, ...trips.filter((t) => !tripIds.has(t.id)).map((t) => ({ ...t, user_id: null }))],
    expenses: [...data.expenses, ...expenses.filter((e) => !expenseIds.has(e.id))],
  });
}

export function clearGuestData() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // 저장소에 접근할 수 없으면 지울 것도 없다
  }
}

function byStartDateDesc(a: Trip, b: Trip) {
  return b.start_date.localeCompare(a.start_date);
}

function byCreatedAtDesc(a: Expense, b: Expense) {
  return b.created_at.localeCompare(a.created_at);
}

function notFound(what: string): never {
  throw new RepositoryError(`${what}을(를) 찾을 수 없습니다.`);
}

function createLocalRepository(): TripRepository {
  return {
    async listTrips() {
      return [...readGuestData().trips].sort(byStartDateDesc);
    },

    async getTrip(id) {
      return readGuestData().trips.find((t) => t.id === id) ?? null;
    },

    async createTrip(input) {
      const data = readGuestData();
      const trip: Trip = {
        ...input,
        id: crypto.randomUUID(),
        user_id: null,
        is_archived: false,
        created_at: new Date().toISOString(),
      };
      writeGuestData({ ...data, trips: [...data.trips, trip] });
      return trip;
    },

    async updateTrip(id, patch) {
      const data = readGuestData();
      const current = data.trips.find((t) => t.id === id) ?? notFound("여행");
      const updated = { ...current, ...patch };
      writeGuestData({ ...data, trips: data.trips.map((t) => (t.id === id ? updated : t)) });
      return updated;
    },

    async deleteTrip(id) {
      const data = readGuestData();
      writeGuestData({
        trips: data.trips.filter((t) => t.id !== id),
        expenses: data.expenses.filter((e) => e.trip_id !== id),
      });
    },

    async listExpenses(tripId) {
      return readGuestData()
        .expenses.filter((e) => e.trip_id === tripId)
        .sort(byCreatedAtDesc);
    },

    async listExpensesByTrips(tripIds) {
      const ids = new Set(tripIds);
      return readGuestData()
        .expenses.filter((e) => ids.has(e.trip_id))
        .sort(byCreatedAtDesc);
    },

    async createExpense(input) {
      const data = readGuestData();
      if (!data.trips.some((t) => t.id === input.trip_id)) notFound("여행");
      const expense: Expense = {
        ...input,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      };
      writeGuestData({ ...data, expenses: [...data.expenses, expense] });
      return expense;
    },

    async updateExpense(id, patch) {
      const data = readGuestData();
      const current = data.expenses.find((e) => e.id === id) ?? notFound("지출");
      const updated = { ...current, ...patch };
      writeGuestData({ ...data, expenses: data.expenses.map((e) => (e.id === id ? updated : e)) });
      return updated;
    },

    async deleteExpense(id) {
      const data = readGuestData();
      writeGuestData({ ...data, expenses: data.expenses.filter((e) => e.id !== id) });
    },
  };
}

/** 게스트 저장소는 하나만 쓴다. TripContext가 저장소가 바뀌었는지 참조로 비교하기 때문이다 */
export const localRepository = createLocalRepository();
