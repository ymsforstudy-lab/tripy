"use client";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import InfoBanner from "./InfoBanner";
import {
  formatBudgetSummary,
  formatNights,
  formatPeriod,
  type TripFormValue,
} from "../_lib/tripForm";

interface TripConfirmSheetProps {
  open: boolean;
  value: TripFormValue;
  /** `수정`: 시트만 닫는다 */
  onEdit: () => void;
  onConfirm: () => void;
  submitting?: boolean;
  errorMessage?: string | null;
}

const ROW_LABEL = "font-medium text-text-muted";
const ROW_VALUE = "text-text-primary opacity-80";

export default function TripConfirmSheet({
  open,
  value,
  onEdit,
  onConfirm,
  submitting = false,
  errorMessage = null,
}: TripConfirmSheetProps) {
  const budget = formatBudgetSummary(value);

  return (
    <Modal open={open} onClose={submitting ? () => {} : onEdit}>
      <div role="dialog" aria-labelledby="trip-confirm-title" className="flex flex-col overflow-hidden rounded-t-12 bg-surface-default">
        <div className="flex items-center gap-4 px-4 pb-4 pt-6">
          <h2 id="trip-confirm-title" className="flex-1 text-title-m font-bold text-text-primary">
            입력한 여행 정보를 확인해주세요
          </h2>
          <div className="size-6 shrink-0" />
        </div>

        <div className="p-4">
          <dl className="flex flex-col gap-4 rounded-12 bg-surface-subtle p-4 text-body-m">
            <div className="flex items-center justify-between">
              <dt className={ROW_LABEL}>여행지</dt>
              <dd className={ROW_VALUE}>{value.destination.trim()}</dd>
            </div>
            <div className="flex items-start justify-between">
              <dt className={ROW_LABEL}>기간</dt>
              <dd className={`flex flex-col items-end text-right ${ROW_VALUE}`}>
                <span>{formatPeriod(value)}</span>
                <span className="font-bold">{formatNights(value)}</span>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className={ROW_LABEL}>예산</dt>
              {budget && (
                <dd className={`flex gap-1 font-bold ${ROW_VALUE}`}>
                  <span>{budget.amount}</span>
                  <span>{budget.unit}</span>
                </dd>
              )}
            </div>
          </dl>
        </div>

        <InfoBanner text="여행 일정은 나중에도 변경할 수 있어요!" className="mx-4" />

        {errorMessage && (
          <p role="alert" className="mx-4 mt-3 text-body-s text-text-danger">
            {errorMessage}
          </p>
        )}

        <div className="flex gap-4 px-4 pb-10 pt-4">
          <div className="flex-1">
            <Button label="수정" variant="secondary" onClick={onEdit} disabled={submitting} />
          </div>
          <div className="flex-1">
            <Button label={submitting ? "저장 중..." : "확인"} onClick={onConfirm} disabled={submitting} />
          </div>
        </div>
      </div>
    </Modal>
  );
}
