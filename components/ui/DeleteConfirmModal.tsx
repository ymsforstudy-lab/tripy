"use client";

import { useEffect } from "react";

interface DeleteConfirmModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  open,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dim overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative z-10 w-[339px] overflow-hidden rounded-xl bg-white">
        {/* Text */}
        <div className="flex flex-col gap-1 px-7 pb-0 pt-6">
          <p className="text-[20px] font-bold leading-[1.5] text-gray-90">
            이 여행을 삭제하시겠습니까?
          </p>
          <p className="text-sm font-normal leading-[1.5] text-gray-60">
            삭제된 여행지는 복구가 어려워요.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-5 px-7 py-6">
          <button
            onClick={onCancel}
            className="flex h-14 flex-1 items-center justify-center rounded-xl border border-gray-50 bg-white text-base font-semibold text-gray-80 opacity-50"
          >
            취소하기
          </button>
          <button
            onClick={onConfirm}
            className="flex h-14 flex-1 items-center justify-center rounded-xl bg-green-50 text-base font-semibold text-white"
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
}
