"use client";

import useInfiniteScroll from "@/hooks/use-infinite-scroll";
import { useRef } from "react";

interface Props {
  nextPage: number | null;
}

const LoadingSpinner = ({ nextPage }: Props) => {
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  const { isPending } = useInfiniteScroll({
    lastElementRef,
    nextPage,
  });

  return (
    <div
      className="w-full flex justify-center items-center p-4 bg-slate-500"
      ref={lastElementRef}
    >
      {isPending && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-spin"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      )}
    </div>
  );
};

export default LoadingSpinner;
