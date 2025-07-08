// scripts/upsertUser.ts
import 'dotenv/config';
import { pc } from '../lib/pinecone';
import { embedProfile } from '../lib/embed';

type User = {
  userId: string,
  bio: string,
  goals: string,
  techStack: string[],
  role: string
}

const user1: User = {
  userId: 'user-345',
  bio: "Looking for help scaling backend systems.",
  goals: "Want mentorship on distributed infra.",
  techStack: ['Node.js', 'Redis'],
  role: 'mentee',
};

const user3: User = {
  userId: 'user-003',
  bio: "Software engineer passionate about AI and ML applications in real-world systems.",
  goals: "Want to connect with like-minded folks exploring LLMs in production.",
  techStack: ['Python', 'TensorFlow', 'Docker'],
  role: 'mentee',
};


const user2: User = {
  userId: 'user-57',
  bio: "I am good at scaling backend systems.",
  goals: "Help students that want to learn about distributed systems and infra.",
  techStack: ['Node.js', 'Redis', 'Kubernetes'],
  role: 'mentor',
};


async function upsertUser(user: User){
  
  let { userId, bio, goals, techStack, role } = user
  const vector = await embedProfile({ bio, goals, techStack });
  
  //index is the table/sapce within your vector database you want to upsert into 
  const index = pc.Index(process.env.PINECONE_INDEX_NAME!);
  await index.upsert([
    {
      id: userId,
      values: vector,
      metadata: { role, onboarding_status: 2, tech_stack: techStack },
    },
  ]);
  

  console.log('Upserted user into Pinecone!');
}


upsertUser(user1);
