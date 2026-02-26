export interface Stats {
  applicationsSent: number;
  savedListings: number;
  activeMessages: number;
}

export interface Landlord {
  name: string;
}

export interface PropertyPreview {
  id: number;
  title: string;
  price: number;
  location?: string;
  images: string[];
  imageUrl?: string;
  landlord: Landlord;
  isSaved?: boolean;
}

export interface Application {
  id: number;
  property: PropertyPreview;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  appliedAt?: string;
}
export interface mapTypes{
  latitude:number
  longitude:number
  value:string
}