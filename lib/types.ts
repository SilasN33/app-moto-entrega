export type UserRole = "admin" | "motoboy";

export type OrderStatus = "pending" | "picked" | "delivered" | "cancelled";

export interface Profile {
  id: string;
  store_id: string;
  role: UserRole;
  full_name: string;
  phone: string | null;
  email: string | null;
  active: boolean;
  created_at: string;
}

export interface Store {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
}

export interface Order {
  id: string;
  store_id: string;
  code: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  address: string;
  notes: string | null;
  amount: number;
  status: OrderStatus;
  motoboy_id: string | null;
  photo_url: string | null;
  created_by: string | null;
  created_at: string;
  picked_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
}

export interface Deduction {
  id: string;
  store_id: string;
  motoboy_id: string;
  amount: number;
  reason: string;
  ref_date: string;
  created_at: string;
}
