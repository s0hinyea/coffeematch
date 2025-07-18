import 'dotenv/config';
import { pc } from '../lib/pinecone';
import { embedProfile } from '../lib/embed';
import { getUserProfile } from '@/lib/getUserProfile'

export async function semanticSearch(userId: string){
  try {
    const profile = await getUserProfile(userId);  
    const { bio, goals, tech_stack } = profile
    console.log("🔍 Retrieved profile:", profile);
    console.log("🔍 USER ID :", userId);

    const queryVector = await embedProfile({ bio, goals, tech_stack });

    const index = pc.Index(process.env.PINECONE_INDEX_NAME!);

    const res = await index.query({
      topK: 1,
      vector: queryVector,
      filter: {
        onboarding_status: 2,
        role: { $nin: ['Mentor', 'mentor'] }
    }
  });
  
  console.log('Query Results: ', JSON.stringify(res.matches, null, 2));
  return res.matches;
  
  } catch (error){
    console.log("🚨 semanticSearch error:", error);
    throw error; // Re-throw so API route catches it
  }
  
}

