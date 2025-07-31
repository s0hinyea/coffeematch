import { supabase } from '@/lib/supabase';

type Interaction = {
  user_id: string;
  matched_id: string;
  status: string;
}

export async function saveInteraction(newInteraction: Interaction) {
  try {
    console.log("Attempting to insert:", newInteraction);

    const { data, error } = await supabase
      .from('interactions')
      .insert(newInteraction);

    console.log("Interaction saved successfully:", data);
    return { success: true, data };

  } catch (error) {
    console.error("Error in saveInteraction:", error);
    throw error; // Re-throw to let the caller handle it
  }
}