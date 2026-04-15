-- ============================================================
-- RLS 정책 설정
-- Supabase Dashboard → SQL Editor에서 실행
-- ============================================================

-- ────────────────────────────────────────────
-- users 테이블
-- ────────────────────────────────────────────
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 기존 정책 제거 (중복 방지)
DROP POLICY IF EXISTS "users: select own" ON users;
DROP POLICY IF EXISTS "users: insert own" ON users;
DROP POLICY IF EXISTS "users: update own" ON users;

CREATE POLICY "users: select own"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "users: insert own"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users: update own"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- ────────────────────────────────────────────
-- trips 테이블
-- ────────────────────────────────────────────
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "trips: select own" ON trips;
DROP POLICY IF EXISTS "trips: insert own" ON trips;
DROP POLICY IF EXISTS "trips: update own" ON trips;
DROP POLICY IF EXISTS "trips: delete own" ON trips;

CREATE POLICY "trips: select own"
  ON trips FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "trips: insert own"
  ON trips FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "trips: update own"
  ON trips FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "trips: delete own"
  ON trips FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ────────────────────────────────────────────
-- expenses 테이블
-- ────────────────────────────────────────────
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "expenses: select own" ON expenses;
DROP POLICY IF EXISTS "expenses: insert own" ON expenses;
DROP POLICY IF EXISTS "expenses: update own" ON expenses;
DROP POLICY IF EXISTS "expenses: delete own" ON expenses;

CREATE POLICY "expenses: select own"
  ON expenses FOR SELECT
  TO authenticated
  USING (
    trip_id IN (
      SELECT id FROM trips WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "expenses: insert own"
  ON expenses FOR INSERT
  TO authenticated
  WITH CHECK (
    trip_id IN (
      SELECT id FROM trips WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "expenses: update own"
  ON expenses FOR UPDATE
  TO authenticated
  USING (
    trip_id IN (
      SELECT id FROM trips WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "expenses: delete own"
  ON expenses FOR DELETE
  TO authenticated
  USING (
    trip_id IN (
      SELECT id FROM trips WHERE user_id = auth.uid()
    )
  );
