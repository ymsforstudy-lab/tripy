-- ============================================================
-- expenses.payment_method 추가
-- 지출 등록 화면에서 필수 입력이지만 저장되지 않던 결제수단을 보관한다.
-- 기존 행은 값을 알 수 없으므로 NULL(미상)로 남긴다.
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
    CREATE TYPE payment_method AS ENUM ('card', 'cash');
  END IF;
END $$;

ALTER TABLE expenses
  ADD COLUMN IF NOT EXISTS payment_method payment_method;

COMMENT ON COLUMN expenses.payment_method IS '결제수단. NULL은 컬럼 추가 이전에 기록된 미상 값.';
