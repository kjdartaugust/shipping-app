export type UserRole = "customer" | "agent" | "admin";

export type ShipmentStatus =
  | "pending"
  | "confirmed"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "exception"
  | "cancelled";

export type ServiceType = "standard" | "express" | "overnight";
export type PackageType =
  | "document"
  | "parcel"
  | "box"
  | "pallet"
  | "fragile";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

export interface Shipment {
  id: string;
  tracking_number: string;
  sender_id: string;
  agent_id: string | null;
  recipient_name: string;
  recipient_phone: string | null;
  recipient_email: string | null;
  origin_address: string;
  origin_lat: number | null;
  origin_lng: number | null;
  dest_address: string;
  dest_lat: number | null;
  dest_lng: number | null;
  package_type: PackageType;
  weight_kg: number;
  length_cm: number | null;
  width_cm: number | null;
  height_cm: number | null;
  declared_value: number | null;
  service_type: ServiceType;
  status: ShipmentStatus;
  price: number;
  notes: string | null;
  estimated_delivery: string | null;
  created_at: string;
  updated_at: string;
  // Relations (optional, populated by joins)
  sender?: Profile;
  agent?: Profile | null;
  tracking_events?: TrackingEvent[];
}

export interface TrackingEvent {
  id: string;
  shipment_id: string;
  status: ShipmentStatus;
  location: string | null;
  lat: number | null;
  lng: number | null;
  note: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  link: string | null;
  read: boolean;
  created_at: string;
}
