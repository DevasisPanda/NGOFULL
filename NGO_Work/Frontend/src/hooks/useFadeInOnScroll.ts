import { useEffect } from 'react';

export function useFadeInOnScroll(deps: any[] = []) {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    const fadeElems = document.querySelectorAll('.fade-in, .fade-in-section');
    fadeElems.forEach((el) => observer.observe(el));

    return () => {
      fadeElems.forEach((el) => observer.unobserve(el));
    };
  }, deps);
}
