import { ReactNode } from "react";
import { CARD_CLASS } from "./constants";

interface DifferenceCardProps {
  icon: ReactNode;
  text: string;
  body:string
}

const DifferenceCard = ({ icon, text, body}: DifferenceCardProps) => {
  return (
    <div className={`${CARD_CLASS} h-full`}>
      {icon}
      <p className={`text-[20px] text-[#000] mt-[15px] ${body? "font-semibold text-[24px] leading-none mb-2" : null}`}>
        {text}
      </p>
      <p className={`text-[18px] text-[#000] mt-[15px]`}>
        {body}
      </p>
    </div>
  );
};

export default DifferenceCard;
