// Simple AOS-like functionality for scroll animations
export class ScrollAnimations {
  private static instance: ScrollAnimations;
  private elements: Set<Element> = new Set();
  private observer: IntersectionObserver;

  private constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );
  }

  static getInstance(): ScrollAnimations {
    if (!ScrollAnimations.instance) {
      ScrollAnimations.instance = new ScrollAnimations();
    }
    return ScrollAnimations.instance;
  }

  observe(element: Element) {
    this.elements.add(element);
    this.observer.observe(element);
  }

  unobserve(element: Element) {
    this.elements.delete(element);
    this.observer.unobserve(element);
  }

  static init() {
    return ScrollAnimations.getInstance();
  }
}

// Hook for React components
import { useEffect, useRef } from 'react';

export function useScrollAnimation(animation: string = 'fade-up') {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.classList.add('aos-element', `aos-${animation}`);
    
    const scrollAnimations = ScrollAnimations.getInstance();
    scrollAnimations.observe(element);

    return () => {
      scrollAnimations.unobserve(element);
    };
  }, [animation]);

  return ref;
}