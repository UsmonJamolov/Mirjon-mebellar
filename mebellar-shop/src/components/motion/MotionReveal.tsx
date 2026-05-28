"use client";

import { motion, type MotionProps, useReducedMotion } from "framer-motion";
import type { PropsWithChildren } from "react";

type RevealDirection = "up" | "down" | "left" | "right" | "none";

function getOffset(direction: RevealDirection, distance: number) {
  switch (direction) {
    case "up":
      return { x: 0, y: distance };
    case "down":
      return { x: 0, y: -distance };
    case "left":
      return { x: distance, y: 0 };
    case "right":
      return { x: -distance, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
}

export function MotionReveal({
  children,
  className,
  direction = "up",
  distance = 22,
  delay = 0,
  duration = 0.6,
  once = true,
  amount = 0.25,
  ...rest
}: PropsWithChildren<
  MotionProps & {
    className?: string;
    direction?: RevealDirection;
    distance?: number;
    delay?: number;
    duration?: number;
    once?: boolean;
    amount?: number;
  }
>) {
  const reduced = useReducedMotion();
  const offset = getOffset(direction, distance);

  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, ...offset }}
      whileInView={reduced ? undefined : { opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

