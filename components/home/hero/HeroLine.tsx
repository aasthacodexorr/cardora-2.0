import Image from "next/image";
import { motion } from "framer-motion";
import { HERO_LINE_CLASS, HERO_TAGLINE_CLASS } from "./constants";
import type { HeroLineProps } from "./types";

const HeroLine = ({ text, image, imageAlt, reverse = false, tagline }: HeroLineProps) => {
  const carTransition = { type: "spring" as const, stiffness: 90, damping: 15, delay: 0.1 };

  return (
    <div className={HERO_LINE_CLASS}>
      {reverse && image && (
        <motion.div 
          initial={{ x: -70, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={carTransition}
          className="w-[120px] sm:w-[160px] md:w-[200px] lg:w-[220px] relative flex-shrink-0"
        >
          <Image
            src={image}
            alt={imageAlt || ""}
            width={220}
            height={100}
            priority
            style={{ width: "100%", height: "auto" }}
            className="md:ml-0"
            sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, (max-width: 1024px) 200px, 220px"
          />
        </motion.div>
      )}
      
      {text && <span className="mr-4">{text}</span>}
      
      {!reverse && image && (
        <motion.div 
          initial={{ x: 70, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={carTransition}
          className="w-[120px] sm:w-[160px] md:w-[200px] lg:w-[220px] relative flex-shrink-0 -ml-[15px] md:ml-0"
        >
          <Image
            src={image}
            alt={imageAlt || ""}
            width={220}
            height={100}
            priority
            style={{ width: "100%", height: "auto" }}
            sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, (max-width: 1024px) 200px, 220px"
          />
        </motion.div>
      )}
      
      {tagline && (
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className={HERO_TAGLINE_CLASS}
        >
          {tagline}
        </motion.span>
      )}
    </div>
  );
};

export default HeroLine;