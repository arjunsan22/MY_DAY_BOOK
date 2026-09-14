"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/**
 * A wrapper component that provides a smooth, GSAP fade-in animation
 * when the element enters the viewport.
 */
export default function FadeIn({ 
  children, 
  delay = 0, 
  duration = 0.6, 
  className = "",
  direction = "up", // "up", "down", "left", "right", "none"
  stagger = 0,
  staggerChildren = false,
  ease = "power3.out"
}) {
  const containerRef = useRef(null);

  useGSAP(() => {
    const el = containerRef.current;
    if (!el) return;

    // Define starting properties based on direction
    const getStartProps = () => {
      switch (direction) {
        case "up": return { y: 30, opacity: 0 };
        case "down": return { y: -30, opacity: 0 };
        case "left": return { x: 30, opacity: 0 };
        case "right": return { x: -30, opacity: 0 };
        case "none": return { opacity: 0 };
        default: return { y: 30, opacity: 0 };
      }
    };

    const startProps = getStartProps();

    if (staggerChildren) {
      // Animate children with a stagger
      const childrenElements = el.children;
      gsap.fromTo(
        childrenElements,
        startProps,
        {
          x: 0,
          y: 0,
          opacity: 1,
          duration: duration,
          delay: delay,
          stagger: stagger || 0.1,
          ease: ease,
          scrollTrigger: {
            trigger: el,
            start: "top 85%", // Trigger when top of element hits 85% of viewport
            toggleActions: "play none none reverse",
          }
        }
      );
    } else {
      // Animate the container itself
      gsap.fromTo(
        el,
        startProps,
        {
          x: 0,
          y: 0,
          opacity: 1,
          duration: duration,
          delay: delay,
          ease: ease,
          scrollTrigger: {
            trigger: el,
            start: "top 90%", // Trigger slightly earlier for individual elements
            toggleActions: "play none none reverse",
          }
        }
      );
    }
  }, { scope: containerRef, dependencies: [direction, delay, duration, staggerChildren, stagger] });

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
