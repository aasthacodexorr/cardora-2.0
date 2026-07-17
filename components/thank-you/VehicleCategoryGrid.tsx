'use client';

import { useRouter } from 'next/navigation';
import car1 from "@/assets/icons/verification-car1.png";
import car2 from "@/assets/icons/verification-car2.png";
import car3 from "@/assets/icons/verification-car3.png";
import car4 from "@/assets/icons/verification-car4.png";
import car5 from "@/assets/icons/verification-car5.png";
import dollarIcon from "@/assets/icons/verification-dollar.png";
import Image from 'next/image';

const VehicleCategoryGrid = () => {
  const router = useRouter();

  const categories = [
    { label: 'Coupe', icon: dollarIcon, bodyTypes: ['Coupe', 'Coupes', 'Coupe 2-Door'] },
    { label: 'Sedan/Coupe', icon: car1, bodyTypes: ['Sedan', 'Sedan 4 Dr.'] },
    { label: 'Wagon', icon: car2, bodyTypes: ['Wagon', 'Station Wagon'] },
    { label: 'SUV', icon: car3, bodyTypes: ['SUV', 'Sport Utility Vehicle', 'SUV-Crossover', 'Suvs', 'Sport Utility 4-Door'] },
    { label: 'Truck', icon: car4, bodyTypes: ['Pickup Truck', 'Truck', 'Pickup-Truck', 'Trucks'] },
    { label: 'Electric', icon: car5, bodyTypes: ['Electric'] }
  ];

  const handleCategoryClick = (bodyTypes: string[]) => {
    const vehicleUrl = `/inventory?${new URLSearchParams({
      bodyStyles: bodyTypes.join(',')
    }).toString()}`;
    router.push(vehicleUrl);
  };

  return (
    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((vehicle, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(vehicle.bodyTypes)}
              className="bg-white rounded-lg p-5 h-28 hover:bg-[#efefef] flex flex-col justify-between items-start shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              {/* Top Row: Icon aligned center/right using flex placement */}
              <div className="w-full flex justify-center items-center h-10 relative">
                {vehicle?.icon && (
                  <Image
                    src={vehicle.icon}
                    alt={`${vehicle.label} icon`}
                    width={48}
                    height={32}
                    className="object-contain max-h-10 grayscale group-hover:grayscale-0 transition-all"
                    loading="eager"
                  />
                )}
              </div>

              {/* Bottom Row: Text label aligned left */}
              <span className="text-base font-bold text-gray-950 tracking-tight">
                {vehicle.label}
              </span>
            </div>
          ))}
        </div>

  );
};

export default VehicleCategoryGrid;
