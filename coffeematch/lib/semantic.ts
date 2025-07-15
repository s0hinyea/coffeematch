import 'dotenv/config';
import { pc } from '../lib/pinecone';
import { embedProfile } from '../lib/embed';
import { getUserProfile } from '@/lib/getUserProfile'

export async function semanticSearch(id: string){
  
  const profile = await getUserProfile(id);  
  const { bio, goals, tech_stack } = profile

  const queryVector = await embedProfile({ bio, goals, tech_stack });
  const index = pc.Index(process.env.PINECONE_INDEX_NAME!);

  const res = await index.query({
    topK: 1,
    vector: queryVector,
    filter: {
      onboarding_status: 2,
      id: { $ne: id }
    }
  });

  console.log('Query Results: ', JSON.stringify(res.matches, null, 2));
  
}

