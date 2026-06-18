import Image from "next/image";
import { HERO_LINE_CLASS, HERO_TAGLINE_CLASS } from "./constants";
import type { HeroLineProps } from "./types";

const HeroLine = ({ text, image, imageAlt, reverse = false, tagline }: HeroLineProps) => {
  return (
    <div className={HERO_LINE_CLASS}>
      {reverse && image && (
        <div className="w-[120px] sm:w-[160px] md:w-[200px] lg:w-[220px] relative flex-shrink-0">
          <Image
            src={image}
            alt={imageAlt || ""}
            width={220}
            height={100}
            priority
            style={{
              width: "100%",
              height: "auto",
            }}
            className="md:ml-0"
            sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, (max-width: 1024px) 200px, 220px"
          />
        </div>
      )}
      {text && <span>{text}</span>}
      {!reverse && image && (
        <div className="w-[120px] sm:w-[160px] md:w-[200px] lg:w-[220px] relative flex-shrink-0 -ml-[15px] md:ml-0">
          <Image
            src={image}
            alt={imageAlt || ""}
            width={220}
            height={100}
            priority
            style={{
              width: "100%",
              height: "auto",
            }}
            className=""
            sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, (max-width: 1024px) 200px, 220px"
          />
        </div>
      )}
      {tagline && (
        <span className={HERO_TAGLINE_CLASS}>
          {tagline}
        </span>
      )}
    </div>
  );
};

export default HeroLine;
