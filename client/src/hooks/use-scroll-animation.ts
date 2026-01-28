import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./use-reduced-motion";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export interface ScrollAnimationOptions {
  trigger?: string | Element;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  toggleActions?: string;
  once?: boolean;
}

/**
 * Hook for scroll-triggered GSAP animations
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  animation: (element: T, tl: gsap.core.Timeline) => void,
  options: ScrollAnimationOptions = {}
) {
  const elementRef = useRef<T>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const element = elementRef.current;
    if (!element || prefersReducedMotion) return;

    const {
      start = "top 80%",
      end = "bottom 20%",
      scrub = false,
      markers = false,
      toggleActions = "play none none reverse",
      once = false,
    } = options;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start,
        end,
        scrub,
        markers,
        toggleActions,
        once,
      },
    });

    animation(element, tl);

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [animation, options, prefersReducedMotion]);

  return elementRef;
}

/**
 * Hook for fade-up animation on scroll
 */
export function useFadeUpOnScroll<T extends HTMLElement = HTMLDivElement>(
  delay: number = 0,
  duration: number = 0.8
) {
  return useScrollAnimation<T>((element, tl) => {
    tl.from(element, {
      y: 50,
      opacity: 0,
      duration,
      delay,
      ease: "power3.out",
    });
  }, { once: true });
}

/**
 * Hook for staggered children animation on scroll
 */
export function useStaggerOnScroll<T extends HTMLElement = HTMLDivElement>(
  childSelector: string,
  staggerAmount: number = 0.1,
  duration: number = 0.6
) {
  return useScrollAnimation<T>((element, tl) => {
    const children = element.querySelectorAll(childSelector);
    tl.from(children, {
      y: 30,
      opacity: 0,
      duration,
      stagger: staggerAmount,
      ease: "power2.out",
    });
  }, { once: true });
}

/**
 * Hook for parallax scroll effect
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  speed: number = 0.5
) {
  return useScrollAnimation<T>(
    (element, tl) => {
      tl.to(element, {
        y: () => -window.innerHeight * speed,
        ease: "none",
      });
    },
    { scrub: true, start: "top bottom", end: "bottom top" }
  );
}

/**
 * Hook for reveal animation with clip-path
 */
export function useRevealOnScroll<T extends HTMLElement = HTMLDivElement>(
  direction: "left" | "right" | "top" | "bottom" = "left",
  duration: number = 1
) {
  const clipPaths = {
    left: {
      from: "inset(0 100% 0 0)",
      to: "inset(0 0% 0 0)",
    },
    right: {
      from: "inset(0 0 0 100%)",
      to: "inset(0 0 0 0%)",
    },
    top: {
      from: "inset(0 0 100% 0)",
      to: "inset(0 0 0% 0)",
    },
    bottom: {
      from: "inset(100% 0 0 0)",
      to: "inset(0% 0 0 0)",
    },
  };

  return useScrollAnimation<T>((element, tl) => {
    tl.fromTo(
      element,
      { clipPath: clipPaths[direction].from },
      { clipPath: clipPaths[direction].to, duration, ease: "power3.inOut" }
    );
  }, { once: true });
}

/**
 * Hook for scaling animation on scroll
 */
export function useScaleOnScroll<T extends HTMLElement = HTMLDivElement>(
  from: number = 0.8,
  duration: number = 0.8
) {
  return useScrollAnimation<T>((element, tl) => {
    tl.from(element, {
      scale: from,
      opacity: 0,
      duration,
      ease: "back.out(1.7)",
    });
  }, { once: true });
}

/**
 * Utility to refresh all ScrollTriggers (useful after dynamic content loads)
 */
export function refreshScrollTriggers() {
  ScrollTrigger.refresh();
}

/**
 * Utility to kill all ScrollTriggers (useful for cleanup)
 */
export function killAllScrollTriggers() {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}
