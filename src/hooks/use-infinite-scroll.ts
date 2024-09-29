import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useTransition,
} from "react";

interface Args {
  lastElementRef: MutableRefObject<HTMLDivElement | null>;
  nextPage: number | null;
}

const useInfiniteScroll = ({ lastElementRef, nextPage }: Args) => {
  const observerElem = useRef<IntersectionObserver | null>(null);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [isPending, startTransition] = useTransition();

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (!entries[0].isIntersecting || nextPage === null) return;

      const params = new URLSearchParams(searchParams);
      params.set("cursor", nextPage.toString());
      startTransition(() => {
        replace(`${pathname}?${params.toString()}`);
      });
    },
    [nextPage, pathname, replace, searchParams]
  );

  const observer = useCallback(
    (node: HTMLDivElement) => {
      if (isPending) return;
      if (observerElem.current) observerElem.current.disconnect();

      observerElem.current = new IntersectionObserver(observerCallback);
      if (node) observerElem.current.observe(node);
    },
    [isPending, observerCallback]
  );

  useEffect(() => {
    const currentElement = lastElementRef.current;
    if (currentElement) observer(currentElement);

    return () => {
      if (observerElem.current && currentElement) {
        observerElem.current.unobserve(currentElement);
      }
    };
  }, [lastElementRef, observer]);

  return { isPending };
};

export default useInfiniteScroll;
