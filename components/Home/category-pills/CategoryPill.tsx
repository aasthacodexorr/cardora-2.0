import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PILL_CLASS } from "./constants";
import type { CategoryPillProps } from "./types";

const CategoryPill = ({ label, icon, href }: CategoryPillProps) => {
  return (
    <Link
      href={href}
      className={PILL_CLASS}
    >
      {icon && (
        <FontAwesomeIcon icon={icon} className="text-[18px] leading-none" />
      )}
      {label}
    </Link>
  );
};

export default CategoryPill;
