import Image from "next/image";
import { HERO_IMAGE_CLASS, HERO_LINE_CLASS, HERO_TAGLINE_CLASS } from "./constants";
import type { HeroLineProps } from "./types";

const HeroLine = ({ text, image, imageAlt, reverse = false, tagline }: HeroLineProps) => {
  return (
    <div className={HERO_LINE_CLASS}>
      {reverse && image && (
        <Image
          src={image}
          alt={imageAlt || ""}
          width={220}
          height={100}
          className={`${HERO_IMAGE_CLASS} md:ml-0`}
        />
      )}
      {text && <span>{text}</span>}
      {!reverse && image && (
        <Image
          src={image}
          alt={imageAlt || ""}
          width={220}
          height={100}
          className={`${HERO_IMAGE_CLASS} -ml-[15px] md:ml-0`}
        />
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
