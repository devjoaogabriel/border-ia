"use client";

import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import * as React from "react";
import { cn } from "@/lib/utils";

interface AnimatedTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text: React.ReactNode;
  gradientColors?: string;
  gradientAnimationDuration?: number;
  hoverEffect?: boolean;
  className?: string;
  textClassName?: string;
  /** Fica no h1, para o aria-labelledby da seção apontar para o título. */
  headingId?: string;
}

const AnimatedText = React.forwardRef<HTMLDivElement, AnimatedTextProps>(
  (
    {
      text,
      gradientColors = "linear-gradient(90deg, #fff 0%, #fff 35%, #c082ff 50%, #fff 65%, #fff 100%)",
      gradientAnimationDuration = 3,
      hoverEffect = false,
      className,
      textClassName,
      headingId,
      ...props
    },
    ref,
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const textRef = React.useRef<HTMLHeadingElement>(null);
    const inView = useInView(textRef);
    const reduceMotion = useReducedMotion();

    const textVariants: Variants = {
      initial: {
        backgroundPosition: "0 0",
      },
      animate: {
        backgroundPosition: "100% 0",
        transition: {
          duration: gradientAnimationDuration,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse" as const,
        },
      },
    };

    return (
      <div ref={ref} className={className} {...props}>
        <motion.h1
          ref={textRef}
          id={headingId}
          className={cn(
            "motion-reduce:bg-none! motion-reduce:[-webkit-text-fill-color:#fff]!",
            textClassName,
          )}
          style={{
            backgroundImage: gradientColors,
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: isHovered ? "0 0 8px rgba(255,255,255,0.3)" : "none",
          }}
          variants={textVariants}
          initial="initial"
          animate={inView && !reduceMotion ? "animate" : "initial"}
          onHoverStart={() => hoverEffect && setIsHovered(true)}
          onHoverEnd={() => hoverEffect && setIsHovered(false)}
        >
          {text}
        </motion.h1>
      </div>
    );
  },
);

AnimatedText.displayName = "AnimatedText";

export { AnimatedText };
