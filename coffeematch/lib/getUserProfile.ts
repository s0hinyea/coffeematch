import { supabase } from '@/lib/supabase';

export async function getUserProfile(userId: string){
  try {
    console.log(userId);
    const { data, error} = await supabase
    .from('users')
    .select('full_name, bio, role, goals, tech_stack')
    .eq('id', userId.trim())
    .single()
    

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.log("🚨 Retrieve profile error:", error);
    throw error;
  }
  
}