export type PropertyType = "APARTMENT" | "HOUSE" | "LAND" | "COMMERCIAL";
export type ListingType = "RENT" | "SALE";

export interface LandlordInfo {
  name: string;
  email: string;
}

export interface Property {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  available: boolean;
  propertyType: PropertyType;
  listingType: ListingType;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  images: string[];
  landlordId: number;
  landlord?: LandlordInfo;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

// Response wrappers to match your res.json({ properties }) logic
export interface PropertiesResponse {
  properties: Property[];
  total?: number;
  page?: number;
  totalPages?: number;
}

export interface SinglePropertyResponse {
  property: Property;
  message?: string;
}