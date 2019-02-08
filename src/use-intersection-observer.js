import { useEffect } from "react";

// We pass refs to the observer so we can access
// the actual reference to the dom node we are targeting
export default function useIntersectionObserver({
  refs,
  callback,
  options = {
    rootMargin: "0px",
    root: null,
    threshold: [0.9, 1]
  }
}) {
  // Setup our api here
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        callback({
          isIntersecting: entry.isIntersecting,
          target: entry.target,
          observer
        });
      });
    }, options);

    refs.forEach(ref => {
      observer.observe(ref.current);
    });

    // Cleanup when the component unmnounts
    return () => observer.disconnect();
  }, []);
}
