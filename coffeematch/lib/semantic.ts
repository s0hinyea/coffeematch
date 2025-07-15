import 'dotenv/config';
import { pc } from '../lib/pinecone';
import { embedProfile } from '../lib/embed';

async function semanticSearch(){
  /** 
  const newQuery = {
    bio: "Software engineer passionate about AI and ML applications in real-world systems.",
    goals: "Want to connect with like-minded folks exploring LLMs in production.",
    techStack: ['Python', 'OCR', 'Docker'],
  };

  const queryVector = await embedProfile(newQuery);
  const index = pc.Index(process.env.PINECONE_INDEX_NAME!);

  const res = await index.query({
    topK: 1,
    vector: queryVector,
    filter: {
      role: 'mentee',
      onboarding_status: 2
    }
  });

  console.log('Query Results: ', JSON.stringify(res.matches, null, 2));
  */
}

semanticSearch();