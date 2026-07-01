/* =========================
   CardoraDifference Component (Home)
   "The Cardora difference" section on the homepage.
   Displays three value-proposition cards, each with
   a custom SVG icon and a short description.
   Used on the homepage and referenced in ProtectionPlans.
========================= */

import Image from "next/image";
import { motion } from "framer-motion";
import DifferenceCard from "./DifferenceCard";
import { ITEMS, CONTAINER_CLASS, GRID_CLASS } from "./constants";

import CheckIcon from "@/assets/icons/CHECK_ICON.svg";
import MapIcon   from "@/assets/icons/MAP-ICON.svg";
import HeartIcon from "@/assets/icons/HEART-ICON.svg";
import { SITE_CONFIG } from "@/constants";

const icons = [
  <Image src={CheckIcon} alt="Check Icon" width={77} height={77} className="w-[77px] h-[77px] rounded-[20px]" />,
  <Image src={MapIcon} alt="Map Icon" width={77} height={77} className="w-[77px] h-[77px] rounded-[20px]" />,
  <Image src={HeartIcon} alt="Heart Icon" width={77} height={77} className="w-[77px] h-[77px] rounded-[20px]" />,
];

const CardoraDifference = () => {
  // Framer Motion parent orchestrator variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring" as const, stiffness: 100, damping: 15 } 
    }
  };

  return (
    <section className="w-full bg-background">
      <div className={CONTAINER_CLASS}>
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
          className="text-[25px] lg:text-[44px] font-bold text-foreground tracking-tight mb-10"
        >
          The {SITE_CONFIG?.dealership.name} difference
        </motion.h2>

        {/* Staggered load-in sequence wrapper */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, margin: "-100px" }}
          className={GRID_CLASS}
        >
          {ITEMS.map((item, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <DifferenceCard
                icon={icons[idx]}
                text={item.text}
                body=""
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CardoraDifference;