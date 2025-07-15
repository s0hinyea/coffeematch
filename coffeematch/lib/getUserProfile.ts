import { supabase } from '@/lib/supabase';

export async function getUserProfile(userId: string){

  const { data, error} = await supabase
  .from('users')
  .select('full_name, bio, role, goals, tech_stack')
  .eq('id', userId)
  .single()

  if (error) throw new Error(error.message);
  return data;
}