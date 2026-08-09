"use client";

import { useEffect, useState } from "react";

/**
 * iOS Safari/Chrome은 온스크린 키보드가 떠도 레이아웃 뷰포트(100vh 등)를
 * 줄이지 않아서, position: fixed; bottom: 0 요소가 키보드에 가려지거나
 * 애니메이션 도중 위치가 튄다. window.visualViewport로 실제 보이는
 * 뷰포트와 레이아웃 뷰포트의 차이(키보드 높이)를 구해 bottom 값으로 보정한다.
 */
export function useKeyboardInset() {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    function update() {
      const offset = window.innerHeight - vv!.height - vv!.offsetTop;
      setInset(offset > 0 ? offset : 0);
    }

    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  return inset;
}
