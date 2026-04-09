import React from 'react';

export default function BudgetSummary() {
  return (
    <div className="relative w-full max-w-[390px] mx-auto min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-6 pb-4">
        <button className="flex items-center justify-center w-6 h-6">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="#1D1D1D"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {/* Empty div for flex-between balance if needed, or just left aligned icon. The design has the title hidden for the header. */}
        <div className="w-6 h-6"></div>
      </header>

      {/* Main Content */}
      <main className="px-4 pt-6">
        {/* Title */}
        <h1 className="text-[24px] font-bold text-gray-90 leading-[1.5] mb-8">
          닉네임을
          <br />
          입력해 주세요
        </h1>

        {/* Form Field */}
        <div className="flex gap-2">
          {/* Input Container */}
          <div className="flex-1 flex items-center justify-between bg-gray-5 border border-gray-60 rounded-xl p-3 h-12">
            <input
              type="text"
              placeholder="소금빵"
              className="w-full bg-transparent text-[14px] font-medium text-gray-90 placeholder:text-gray-60 focus:outline-none"
            />
            {/* Search or Clear Icon equivalent from Figma - here we just add a small gray close button if needed, but a standard search or just empty is fine. Design showed a lucide:search or something, let's keep it simple. */}
          </div>

          {/* Duplication Check Button */}
          <button className="w-[88px] h-12 shrink-0 bg-green-50 text-white text-[16px] font-bold rounded-xl flex items-center justify-center">
            중복확인
          </button>
        </div>
      </main>

      {/* Bottom Fixed Bar */}
      <div className="absolute bottom-0 left-0 w-full px-4 pt-4 pb-8 bg-white border-t border-gray-20">
        <button className="w-full h-14 bg-green-50 text-white text-[16px] font-bold rounded-xl flex items-center justify-center">
          다음
        </button>
      </div>
    </div>
  );
}
