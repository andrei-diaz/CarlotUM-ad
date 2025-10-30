import { motion, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";

// Placeholder images - puedes reemplazarlas con fotos reales de carlotas
const images = [
  "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=600&fit=crop",
];

const ParallaxGallery = () => {
  const gallery = useRef(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  const { height } = dimension;
  const y = useTransform(scrollYProgress, [0, 1], [0, height * 2]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, height * 3.3]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 1.25]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, height * 3]);

  useEffect(() => {
    const lenis = new Lenis();

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", resize);
    requestAnimationFrame(raf);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <main className="w-full bg-gradient-to-br from-primary-50 via-white to-lemon-50">
      <div className="flex h-screen items-center justify-center gap-2">
        <div className="absolute left-1/2 top-[10%] grid -translate-x-1/2 content-start justify-items-center gap-6 text-center">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-lemon-500 bg-clip-text text-transparent mb-4">
            Nuestra Galería
          </h2>
          <span className="relative max-w-[20ch] text-sm uppercase leading-tight opacity-60 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-primary-200 after:to-primary-600 after:content-['']">
            desliza para ver más fotos
          </span>
        </div>
      </div>

      <div
        ref={gallery}
        className="relative box-border flex h-[175vh] gap-[2vw] overflow-hidden bg-white p-[2vw]"
      >
        <Column images={[images[0], images[1], images[2]]} y={y} />
        <Column images={[images[3], images[4], images[5]]} y={y2} />
        <Column images={[images[6], images[7], images[8]]} y={y3} />
        <Column images={[images[9], images[10], images[11]]} y={y4} />
      </div>

      <div className="relative flex h-screen items-center justify-center gap-2 bg-gradient-to-br from-primary-50 via-white to-lemon-50">
        <div className="absolute left-1/2 top-[10%] grid -translate-x-1/2 content-start justify-items-center gap-6 text-center">
          <h3 className="text-4xl font-bold text-gray-800 mb-4">
            ¿Te gustó lo que viste?
          </h3>
          <p className="text-xl text-gray-600 max-w-2xl px-6">
            Cada carlota es única y especial. Haz tu pedido ahora y disfruta del sabor auténtico.
          </p>
          <button className="mt-8 bg-gradient-to-r from-primary-500 to-lemon-400 text-white px-10 py-4 rounded-full text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            Ordenar Ahora 🍋
          </button>
        </div>
      </div>
    </main>
  );
};

const Column = ({ images, y }) => {
  return (
    <motion.div
      className="relative -top-[45%] flex h-full w-1/4 min-w-[250px] flex-col gap-[2vw] first:top-[-45%] [&:nth-child(2)]:top-[-95%] [&:nth-child(3)]:top-[-45%] [&:nth-child(4)]:top-[-75%]"
      style={{ y }}
    >
      {images.map((src, i) => (
        <div key={i} className="relative h-full w-full overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <img
            src={src}
            alt={`Carlota ${i + 1}`}
            className="pointer-events-none object-cover w-full h-full"
          />
        </div>
      ))}
    </motion.div>
  );
};

export default ParallaxGallery;
