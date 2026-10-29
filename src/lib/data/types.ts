// 여행·지출 데이터 타입. 컬럼은 현재 Supabase 테이블 기준이다.
// 테이블 생성 스키마가 저장소에 없으므로 컬럼을 바꾸면 이 파일도 같이 고친다.

export type PaymentMethod = "card" | "cash";

export type Trip = {
  id: string;
  /** 게스트(localStorage) 여행은 null */
  user_id: string | null;
  title: string;
  destination: string | null;
  /** 'YYYY-MM-DD' */
  start_date: string;
  /** 'YYYY-MM-DD'. 당일치기는 start_date와 같다 */
  end_date: string;
  // TODO: 예산 미입력 허용이 결정되면 number | null 로 바꾼다 (docs/flow-v2.md §7)
  total_budget: number;
  currency: string;
  is_archived: boolean;
  created_at: string;
};

export type Expense = {
  id: string;
  trip_id: string;
  amount: number;
  currency: string;
  category: string;
  /** 컬럼 추가 이전에 기록된 지출은 null */
  payment_method: PaymentMethod | null;
  /** 'YYYY-MM-DD' */
  expense_date: string;
  description: string | null;
  created_at: string;
};

/** 여행 생성 입력. 예산까지 한 번에 받는다 */
export type TripInput = Pick<
  Trip,
  "title" | "destination" | "start_date" | "end_date" | "total_budget" | "currency"
>;

export type ExpenseInput = Pick<
  Expense,
  "trip_id" | "amount" | "currency" | "category" | "payment_method" | "expense_date" | "description"
>;
