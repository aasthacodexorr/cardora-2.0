declare module 'lucide-react' {
  import { FC, SVGAttributes } from 'react';

  interface IconProps extends SVGAttributes<SVGElement> {
    size?: string | number;
    absoluteStrokeWidth?: boolean;
  }

  type Icon = FC<IconProps>;

  // All icons used in the project
  export const Phone: Icon;
  export const MapPin: Icon;
  export const Stethoscope: Icon;
  export const ThermometerSun: Icon;
  export const AlertCircle: Icon;
  export const Cog: Icon;
  export const Compass: Icon;
  export const Star: Icon;
  export const Clock: Icon;
  export const ShieldCheck: Icon;
  export const ArrowRight: Icon;
  export const Heart: Icon;
  export const ChevronDown: Icon;
  export const Menu: Icon;
  export const X: Icon;
  export const Search: Icon;
  export const ChevronLeft: Icon;
  export const ChevronRight: Icon;
  export const Facebook: Icon;
  export const Instagram: Icon;
  export const Twitter: Icon;
  export const Youtube: Icon;
  export const Mail: Icon;
  export const MessageCircle: Icon;
  export const Copy: Icon;
  export const Check: Icon;
  export const AlertTriangle: Icon;
  export const Loader: Icon;
  export const Upload: Icon;
  export const Download: Icon;
  export const RefreshCw: Icon;
  export const Settings: Icon;
  export const User: Icon;
  export const LogOut: Icon;
  export const Home: Icon;
  export const Car: Icon;
  export const Calendar: Icon;
  export const Clock24h: Icon;
  export const TrendingUp: Icon;
  export const FileText: Icon;
  export const CalendarCheck: Icon;
  export const CarFrontIcon: Icon;
  export const CarFront: Icon;
  export const Settings2: Icon;
  export const Cpu: Icon;
  export const Zap: Icon;
  export const Activity: Icon;
  export const Snowflake: Icon;
  export const Wind: Icon;
  export const KeyRound: Icon;
  export const Truck: Icon;
  export const Wallet: Icon;
  export const PhoneCall: Icon;
  export const Wrench: Icon;
  export const Fuel: Icon;
  export const PaintBucket: Icon;
  export const Palette: Icon;
  export const Radiation: Icon;
  export const ChevronUp:Icon;
  export const Lock:Icon;
  export const Smartphone:Icon;
  export const Smile:Icon;
}
