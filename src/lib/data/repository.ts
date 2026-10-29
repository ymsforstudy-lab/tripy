import type { Expense, ExpenseInput, Trip, TripInput } from "./types";

/**
 * 여행·지출 저장소. 로그인 사용자는 Supabase, 게스트는 localStorage 구현을 쓴다.
 * 화면은 `useRepository()`로 받아서 쓰고 supabase를 직접 호출하지 않는다.
 *
 * 모든 메서드는 실패하면 RepositoryError를 throw한다.
 * 호출부는 try/catch로 입력값을 유지하고, 성공한 뒤에만 이동한다.
 */
export interface TripRepository {
  /** 출발일 내림차순 */
  listTrips(): Promise<Trip[]>;
  getTrip(id: string): Promise<Trip | null>;
  /** 여행과 초기 예산을 insert 한 번으로 저장한다 */
  createTrip(input: TripInput): Promise<Trip>;
  updateTrip(id: string, patch: Partial<TripInput>): Promise<Trip>;
  deleteTrip(id: string): Promise<void>;

  /** 등록 최신순 */
  listExpenses(tripId: string): Promise<Expense[]>;
  /** 여러 여행의 지출을 한 번에 조회한다 (마이페이지 통계용) */
  listExpensesByTrips(tripIds: string[]): Promise<Expense[]>;
  createExpense(input: ExpenseInput): Promise<Expense>;
  updateExpense(id: string, patch: Partial<ExpenseInput>): Promise<Expense>;
  deleteExpense(id: string): Promise<void>;
}

export class RepositoryError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "RepositoryError";
  }
}
