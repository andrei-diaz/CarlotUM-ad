import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

const navigationItems = [
  {
    name: "Inicio",
    href: "/",
  },
  {
    name: "Producto",
    href: "/producto",
  },
  {
    name: "Reseñas",
    href: "/resenas",
  },
  {
    name: "Login",
    href: "/login",
  },
  {
    name: "Registro",
    href: "/register",
  },
];

const AnimatedNav = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 via-white to-lemon-100 flex items-center justify-center">
      <ul className="flex min-h-full w-full flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl px-7 py-3">
        {navigationItems.map((item, index) => (
          <li
            className="relative flex cursor-pointer flex-col items-center overflow-visible"
            key={index}
          >
            <Link to={item.href} className="relative flex items-start">
              <TextRoll
                center
                className="text-5xl font-extrabold uppercase leading-[0.8] tracking-[-0.03em] transition-colors lg:text-7xl bg-gradient-to-r from-primary-600 to-lemon-500 bg-clip-text text-transparent"
              >
                {item.name}
              </TextRoll>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const STAGGER = 0.035;

const TextRoll = ({ children, className, center = false }) => {
  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      className={cn("relative block overflow-hidden", className)}
      style={{
        lineHeight: 0.75,
      }}
    >
      <div>
        {children.split("").map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: {
                  y: 0,
                },
                hovered: {
                  y: "-100%",
                },
              }}
              transition={{
                ease: "easeInOut",
                delay,
              }}
              className="inline-block"
              key={i}
            >
              {l}
            </motion.span>
          );
        })}
      </div>
      <div className="absolute inset-0">
        {children.split("").map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: {
                  y: "100%",
                },
                hovered: {
                  y: 0,
                },
              }}
              transition={{
                ease: "easeInOut",
                delay,
              }}
              className="inline-block"
              key={i}
            >
              {l}
            </motion.span>
          );
        })}
      </div>
    </motion.span>
  );
};

export default AnimatedNav;
export { TextRoll };
