"use client";

import { motion } from "framer-motion";

interface HeroWelcomeBackProps {
  fullWidth?: boolean;
}

const HeroWelcomeBack = ({ fullWidth = false }: HeroWelcomeBackProps) => {
  return (
    <div className={`w-full flex ${fullWidth ? "justify-start" : ""}`}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`flex flex-col items-start w-full font-semibold ${
          fullWidth ? "items-center text-center" : ""
        }`}
      >
        <h1 className="text-[41px] sm:text-[60px] md:text-7xl lg:text-[90px] font-semibold leading-[1.05] tracking-tight text-foreground">
          Welcome Back
        </h1>
        <p className="font-carmax text-[20px] sm:text-[18px] md:text-[22px] lg:text-[28px] leading-[22px] text-black font-medium mt-4 sm:mt-3 max-w-[520px] leading-[26px] sm:leading-[30px] md:leading-[40px]">
          Ready to find your next pre-owned car?
        </p>
      </motion.div>
    </div>
  );
};

export default HeroWelcomeBack;
