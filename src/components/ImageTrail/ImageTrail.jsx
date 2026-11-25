"use client";
import "./ImageTrail.css";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const IMAGES = Array.from({ length: 10 }, (_, i) => `/stickers/s${i + 1}.png`);
const THRESHOLD = 100;

export default function ImageTrail({ children, className = "" }) {
  const containerRef = useRef(null);
  const lastPos = useRef(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const spawnImage = contextSafe((from, to) => {
    const img = document.createElement("img");
    img.src = IMAGES[Math.floor(Math.random() * IMAGES.length)];
    img.className = "trail-img";
    img.alt = "";
    containerRef.current.appendChild(img);

    gsap
      .timeline({ onComplete: () => img.remove() })
      .fromTo(
        img,
        {
          x: from.x,
          y: from.y,
          xPercent: -50,
          yPercent: -50,
          rotation: gsap.utils.random(-25, 25),
          scale: 0,
        },
        {
          x: to.x + (to.x - from.x) * 0.75,
          y: to.y + (to.y - from.y) * 0.75,
          scale: 1,
          duration: 1,
          ease: "expo.out",
        },
      )
      .to(img, { scale: 0, duration: 0.65, ease: "power2.inOut" }, "+=0.15");
  });

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    if (!lastPos.current) {
      lastPos.current = pos;
      return;
    }

    const distance = Math.hypot(
      pos.x - lastPos.current.x,
      pos.y - lastPos.current.y,
    );
    if (distance < THRESHOLD) return;

    spawnImage(lastPos.current, pos);
    lastPos.current = pos;
  };

  const handleMouseLeave = () => {
    lastPos.current = null;
  };

  return (
    <section
      ref={containerRef}
      className={`image-trail ${className}`.trim()}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </section>
  );
}
