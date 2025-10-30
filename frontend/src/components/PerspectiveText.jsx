import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import ReactLenis from "lenis/react";
import React, { useRef } from "react";

const PerspectiveText = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const yMotionValue = useTransform(scrollYProgress, [0, 1], [487, 0]);
  const transform = useMotionTemplate`rotateX(30deg) translateY(${yMotionValue}px) translateZ(10px)`;

  return (
    <ReactLenis root>
      <div
        ref={targetRef}
        className="relative z-0 h-[300vh] w-screen bg-gradient-to-br from-primary-50 via-white to-lemon-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-800 dark:text-white"
      >
        <div className="absolute left-1/2 top-[10%] grid -translate-x-1/2 content-start justify-items-center gap-6 text-center">
          <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-primary-200 after:to-primary-600 dark:after:from-gray-600 dark:after:to-gray-400 after:content-['']">
            sigue bajando
          </span>
        </div>
        <div
          className="sticky top-0 mx-auto flex items-center justify-center bg-transparent py-20"
          style={{
            transformStyle: "preserve-3d",
            perspective: "200px",
          }}
        >
          <motion.div
            style={{
              transformStyle: "preserve-3d",
              transform,
            }}
            className="w-full max-w-4xl px-6 text-center text-5xl font-bold tracking-tighter lg:text-6xl bg-gradient-to-r from-primary-600 via-primary-500 to-lemon-500 bg-clip-text text-transparent"
          >
            Cada carlota es una obra maestra. Limones frescos, crema suave y galletas 
            crujientes se combinan en perfección. Un postre que cuenta historias de tradición 
            y amor por los detalles. Elaborada con las manos de artesanos apasionados que 
            entienden que el verdadero sabor viene del corazón. Cada capa, cada textura, 
            cada bocado es una celebración de la vida. CarlotUM: donde la tradición mexicana 
            se encuentra con la innovación culinaria. Más que un postre, es una experiencia 
            que transporta tus sentidos.
            <div className="absolute bottom-0 left-0 h-[60vh] w-full bg-gradient-to-b from-transparent to-white dark:to-gray-900" />
          </motion.div>
        </div>
      </div>
    </ReactLenis>
  );
};

export default PerspectiveText;
