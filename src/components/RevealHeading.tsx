import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Wibify-style scroll entrance for section headings:
 * scales up from 0.85 and fades in when scrolled into view.
 */
const RevealHeading = ({
  children,
  className,
  as: Tag = "h2",
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) => {
  const MotionTag = motion[Tag];
  return (
    <MotionTag
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: "left bottom" }}
      className={className}
    >
      {children}
    </MotionTag>
  );
};

export default RevealHeading;
