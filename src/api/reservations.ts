import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

type Reservation = Database['public']['Tables']['reservations']['Row'];
type ReservationInsert = Database['public']['Tables']['reservations']['Insert'];
// type ReservationUpdate = Database['public']['Tables']['reservations']['Update'];

export async function getReservations(supabase: SupabaseClient<Database>): Promise<Reservation[]> {
  const { data, error } = await supabase.from('reservations').select('*').order('reservation_time', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getCustomerReservations(supabase: SupabaseClient<Database>, customerId: string): Promise<Reservation[]> {
  const { data, error } = await supabase.from('reservations').select('*').eq('customer_id', customerId).order('reservation_time', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getReservationById(supabase: SupabaseClient<Database>, id: string): Promise<Reservation | null> {
  const { data, error } = await supabase.from('reservations').select('*').eq('id', id).single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function createReservation(supabase: SupabaseClient<Database>, reservation: ReservationInsert): Promise<Reservation> {
  const { data, error } = await supabase.from('reservations').insert(reservation).select().single();
  if (error) throw error;
  return data;
}

export async function updateReservationStatus(supabase: SupabaseClient<Database>, id: string, status: string): Promise<Reservation> {
  const { data, error } = await supabase.from('reservations').update({ status }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}
