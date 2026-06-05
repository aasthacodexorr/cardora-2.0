import { ReactNode } from "react";
import { CARD_CLASS } from "./constants";

interface DifferenceCardProps {
  icon: ReactNode;
  text: string;
}

const DifferenceCard = ({ icon, text }: DifferenceCardProps) => {
  return (
    <div className={`${CARD_CLASS} h-full`}>
      {icon}
      <p className="text-[20px] text-[#000] mt-[15px] leading-relaxed">
        {text}
      </p>
    </div>
  );
};

export default DifferenceCard;
