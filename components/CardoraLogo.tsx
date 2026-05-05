import Image from "next/image";

const CardoraLogo = () => {
  return (
    <Image
      src="/cardora-logo.png"
      alt="Cardora — A Robinson Motor Company"
      width={200}
      height={60}
      priority
      className="h-[48px] w-auto object-contain"
    />
  );
};

export default CardoraLogo;
