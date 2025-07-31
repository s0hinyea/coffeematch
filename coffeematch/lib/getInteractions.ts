import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile } from "@/lib/getUserProfile";

export async function getInteractions(userId: string, status: string){

  try{

    //Select all interactions of user
    let query = supabase
    .from('interactions')
    .select('*')
    .eq('user_id', userId);

    //Filter either skips or matches 
    if (status) {
      query = query.eq('status', status);
    }

    //order from most latest to earliest 
    const {data, error} = await query.order('created_at', {ascending: false})

    return data;
  } catch (error) {
    console.error("No fetching: ", error)
  }

}

export async function fetchInteractions(userId:string, status: string){

  try{

    const data = await getInteractions(userId, status);

    const interactionProfiles = await Promise.all( 
      data!.map( async (interaction) => {
        const profile = await getUserProfile(interaction.matched_id);
        return {
          ...interaction,
          matchedUserProfile: profile
        };
      })
    );

    return interactionProfiles;
  } catch (error) {
    console.error("Fetch Mishap: ", error)
  }

  

}