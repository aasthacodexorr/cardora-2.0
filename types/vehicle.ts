export interface ManufacturerWarrantyDetail {
  warranty_type?: string;
  coverage?: string;
  years?: string | number;
  months?: string | number;
  mileage_limit?: string | number;
  is_unlimited_mileage?: string | number | boolean;
}

export interface PopularFeatureTag {
  label: string;
  icon: string;
  value: string;
}

export interface Vehicle {
  id: string | number;
  stock_no?: string;
  year?: number | string;
  make?: string;
  model?: string;
  trim?: string;
  title?: string;
  price?: number | string;
  special_price?: number | string;
  odometer?: number | string;
  body_type?: string;
  exterior_color?: string;
  interior_color?: string;
  transmission?: string;
  drivetrain?: string;
  fuel_type?: string;
  vehicle_description?: string;
  image_urls?: string;
  status?: string;

  // Phase 2 Attributes
  show_manufacturer_warranty_details?: number | boolean | string;
  in_service_date?: number | string;
  manufacturer_warranty_details?: ManufacturerWarrantyDetail[] | string | null;
  popular_features?: string[] | string;
  internal_tags?: string[] | string;

  [key: string]: any;
}
