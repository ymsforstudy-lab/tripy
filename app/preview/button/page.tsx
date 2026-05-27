"use client";

import Button from "@/components/ui/Button";

export default function ButtonPreviewPage() {
  return (
    <div className="min-h-screen bg-gray-5 p-8">
      <h1 className="mb-8 text-xl font-bold text-gray-90">Button 컴포넌트 미리보기</h1>

      {/* Primary */}
      <section className="mb-8">
        <h2 className="mb-4 text-sm font-semibold text-gray-60">Primary</h2>
        <div className="flex flex-col gap-3">
          <Button label="Primary Active L" variant="primary" size="L" />
          <Button label="Primary Active M" variant="primary" size="M" />
          <Button label="Primary Deactive L" variant="primary" size="L" disabled />
          <Button label="Primary Deactive M" variant="primary" size="M" disabled />
        </div>
      </section>

      {/* Secondary */}
      <section className="mb-8">
        <h2 className="mb-4 text-sm font-semibold text-gray-60">Secondary</h2>
        <div className="flex flex-col gap-3">
          <Button label="Secondary Active L" variant="secondary" size="L" />
          <Button label="Secondary Active M" variant="secondary" size="M" />
          <Button label="Secondary Deactive L" variant="secondary" size="L" disabled />
          <Button label="Secondary Deactive M" variant="secondary" size="M" disabled />
        </div>
      </section>

      {/* Side by Side */}
      <section>
        <h2 className="mb-4 text-sm font-semibold text-gray-60">나란히 (취소 + 확인)</h2>
        <div className="flex gap-4">
          <Button label="취소하기" variant="secondary" />
          <Button label="등록하기" variant="primary" />
        </div>
      </section>
    </div>
  );
}
