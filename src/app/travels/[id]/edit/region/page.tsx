import { redirect } from "next/navigation";

// 1.x 국내 지역 선택 화면. 2.0은 /setup?tripId=...으로 통합 (docs/flow-v2.md §5)
export default async function LegacyEditRegionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/setup?tripId=${id}`);
}
