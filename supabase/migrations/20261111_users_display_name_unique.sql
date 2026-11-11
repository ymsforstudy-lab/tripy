-- ============================================================
-- users.display_name 중복 금지
-- 1) display_name에 unique 제약을 건다. 동시에 같은 닉네임을 저장해도 하나만 성공한다.
--    중복이면 Postgres가 23505(unique_violation)를 돌려준다.
--    src/lib/nickname.ts(자동 생성)와 /mypage/profile(수정)이 이 코드를 처리한다.
-- 2) is_display_name_available(): RLS가 본인 행만 조회를 허용해서
--    클라이언트는 다른 사람 닉네임을 볼 수 없다. 중복 확인만 할 수 있게 boolean만 돌려준다.
--
-- 실행 전: 이미 중복된 닉네임이 있으면 이 마이그레이션은 실패한다. 먼저 아래로 확인하고 정리한다.
--   SELECT display_name, count(*) FROM users
--   WHERE display_name IS NOT NULL GROUP BY display_name HAVING count(*) > 1;
-- ============================================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM users
    WHERE display_name IS NOT NULL
    GROUP BY display_name
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION '중복된 display_name이 있습니다. 파일 상단의 조회문으로 확인해 정리한 뒤 다시 실행하세요.';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'users_display_name_key' AND conrelid = 'public.users'::regclass
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_display_name_key UNIQUE (display_name);
  END IF;
END $$;

-- 닉네임 사용 가능 여부. 본인이 이미 쓰는 닉네임은 사용 가능으로 본다.
CREATE OR REPLACE FUNCTION public.is_display_name_available(name text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM users
    WHERE display_name = name
      AND id IS DISTINCT FROM auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION public.is_display_name_available(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_display_name_available(text) TO authenticated;
