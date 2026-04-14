import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

type Category = Database['public']['Tables']['categories']['Row'];
type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

export async function getCategories(supabase: SupabaseClient<Database>): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) throw error;
  return data;
}

export async function getCategoryById(supabase: SupabaseClient<Database>, id: string): Promise<Category | null> {
  const { data, error } = await supabase.from('categories').select('*').eq('id', id).single();
  if (error && error.code !== 'PGRST116') throw error; // Handle code 116 (No rows found)
  return data;
}

export async function createCategory(supabase: SupabaseClient<Database>, category: CategoryInsert): Promise<Category> {
  const { data, error } = await supabase.from('categories').insert(category).select().single();
  if (error) throw error;
  return data;
}

export async function updateCategory(supabase: SupabaseClient<Database>, id: string, category: CategoryUpdate): Promise<Category> {
  const { data, error } = await supabase.from('categories').update(category).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(supabase: SupabaseClient<Database>, id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}
