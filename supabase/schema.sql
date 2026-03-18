-- ============================================================
-- Tripy DB Schema
-- Supabase SQL Editor에서 순서대로 실행
-- ============================================================


-- ============================================================
-- 1. USERS
-- Supabase Auth(Google OAuth)와 연동되는 프로필 테이블
-- 게스트 유저는 localStorage만 사용 (이 테이블에 row 없음)
-- ============================================================

CREATE TABLE public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  display_name TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.users IS '소셜 로그인 유저 프로필. 게스트 유저는 localStorage 사용.';

-- Google 로그인 시 자동으로 users row 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at 자동 갱신
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- 2. TRIPS (여행)
-- ============================================================

CREATE TABLE public.trips (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,                      -- 여행 이름 (예: 오사카 여행)
  destination   TEXT,                               -- 여행지
  start_date    DATE NOT NULL,
  end_date      DATE NOT NULL,
  total_budget  NUMERIC(14, 2) NOT NULL DEFAULT 0,  -- 총 예산
  currency      TEXT NOT NULL DEFAULT 'KRW',        -- 기준 통화
  is_archived   BOOLEAN NOT NULL DEFAULT false,     -- 종료된 여행
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT trips_date_check CHECK (end_date >= start_date),
  CONSTRAINT trips_budget_check CHECK (total_budget >= 0)
);

COMMENT ON TABLE public.trips IS '여행 정보. 게스트 여행은 localStorage에 동일 구조로 저장.';

CREATE TRIGGER trips_updated_at
  BEFORE UPDATE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- 3. EXPENSES (지출)
-- ============================================================

CREATE TYPE public.expense_category AS ENUM (
  'food',         -- 식비
  'transport',    -- 교통
  'accommodation',-- 숙박
  'shopping',     -- 쇼핑
  'activity',     -- 액티비티/관광
  'etc'           -- 기타
);

CREATE TABLE public.expenses (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id      UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  amount       NUMERIC(14, 2) NOT NULL,
  currency     TEXT NOT NULL DEFAULT 'KRW',
  category     public.expense_category NOT NULL DEFAULT 'etc',
  description  TEXT,
  expense_date DATE NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT expenses_amount_check CHECK (amount > 0)
);

COMMENT ON TABLE public.expenses IS '지출 내역. trip_id로 여행과 연결.';

CREATE TRIGGER expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- 로그인 유저는 자신의 데이터만 접근 가능
-- ============================================================

ALTER TABLE public.users   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- users: 본인 row만
CREATE POLICY "users: 본인만 조회" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users: 본인만 수정" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- trips: 본인 여행만
CREATE POLICY "trips: 본인만 조회" ON public.trips
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "trips: 본인만 생성" ON public.trips
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "trips: 본인만 수정" ON public.trips
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "trips: 본인만 삭제" ON public.trips
  FOR DELETE USING (auth.uid() = user_id);

-- expenses: trips를 통해 본인 데이터만
CREATE POLICY "expenses: 본인만 조회" ON public.expenses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = expenses.trip_id
        AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "expenses: 본인만 생성" ON public.expenses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = expenses.trip_id
        AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "expenses: 본인만 수정" ON public.expenses
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = expenses.trip_id
        AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "expenses: 본인만 삭제" ON public.expenses
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = expenses.trip_id
        AND trips.user_id = auth.uid()
    )
  );


-- ============================================================
-- 5. 인덱스
-- ============================================================

CREATE INDEX idx_trips_user_id     ON public.trips(user_id);
CREATE INDEX idx_trips_start_date  ON public.trips(start_date);
CREATE INDEX idx_expenses_trip_id  ON public.expenses(trip_id);
CREATE INDEX idx_expenses_date     ON public.expenses(expense_date);
CREATE INDEX idx_expenses_category ON public.expenses(category);
