"use client";

import { useEffect, useRef, useState } from "react";

interface RevealProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * 화면에 들어오면 data-inview="true"가 되는 섹션.
 * 안쪽의 [data-reveal] 요소가 landing.css의 등장 애니메이션을 한 번 재생한다.
 */
export default function Reveal({ className = "", children }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} data-inview={inView} className={className}>
      {children}
    </section>
  );
}
